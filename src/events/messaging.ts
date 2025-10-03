import {getCurrentTab} from '../misc.js'

type MessageHandler<T = any, R = any> = (payload: T) => Promise<R> | R

export class ActionMessenger<T = any, R = any> {
	constructor(private action: string) {}

	/**
	 * Send a message to the extension runtime (background / popup / options / sidepanel / etc...)
	 *
	 * Content script can't intercept this one directly.
	 */
	broadcast(payload?: T): Promise<R> {
		return new Promise((resolve, reject) => {
			chrome.runtime.sendMessage(
				{action: this.action, data: payload},
				(response) => {
					const err = chrome.runtime.lastError
					if (err) {
						console.error(`Error while broadcasting "${this.action}"`)
						reject(err)
					} else resolve(response as R)
				},
			)
		})
	}

	/**
	 * Send a message to a specific tab.
	 *
	 * You don't need "tabs" permission to use this.
	 */
	async sendToTab(tabId: number, payload?: T): Promise<R> {
		return new Promise((resolve, reject) => {
			chrome.tabs.sendMessage(
				tabId,
				{action: this.action, data: payload},
				(response) => {
					const err = chrome.runtime.lastError
					if (err) {
						console.error(`Error while sending to tab "${this.action}"`)
						reject(err)
					} else resolve(response as R)
				},
			)
		})
	}

	/**
	 * This is different from broadcast().
	 * broadcast() will send a message to all runtimes scripts (background, options, popup, ...).
	 * This is just a broadcast for all tabs.
	 * You'll have to use a content script to intercept the message.
	 *
	 * Also, consider `chrome.storage.onChanged.addListener` as an alternate.
	 */
	async sendToAllTabs(payload?: T): Promise<R[]> {
		const responses: R[] = []

		return new Promise((resolve, reject) => {
			chrome.tabs.query({}, (tabs) => {
				if (!tabs || tabs.length === 0) return resolve(responses)

				let pending = tabs.length

				tabs.forEach((tab) => {
					if (tab.id === undefined) {
						pending--
						if (pending === 0) resolve(responses)
						return
					}

					chrome.tabs.sendMessage(
						tab.id,
						{action: this.action, data: payload},
						(response) => {
							const err = chrome.runtime.lastError
							if (!err && response !== undefined) responses.push(response as R)
							// else you can log or ignore errors per tab

							pending--
							if (pending === 0) resolve(responses)
						},
					)
				})
			})
		})
	}

	/**
	 * Send a message to the current tab.
	 *
	 * You don't need "tabs" permission to use this.
	 */
	async sendToCurrentTab(payload?: T): Promise<R | undefined> {
		const tab = await getCurrentTab()
		if (tab?.id !== undefined) {
			return this.sendToTab(tab.id, payload)
		}
		console.warn(`No active tab found for action "${this.action}"`)
		return undefined
	}

	/**
	 * Register a handler for this action
	 */
	catch(handler: MessageHandler<T, R>) {
		chrome.runtime.onMessage.addListener(
			(msg: {action: string; data?: any}, sender, sendResponse) => {
				if (msg.action === this.action) {
					try {
						const result = handler(msg.data as T)
						if (result instanceof Promise) {
							result.then(sendResponse).catch(console.error)
							return true // indicates async response
						} else {
							sendResponse(result)
						}
					} catch (err) {
						console.error(err)
						sendResponse({error: (err as any)?.message || err})
					}
				}
			},
		)
	}
}
