type MessageHandler<T = any, R = any> = (payload: T) => Promise<R> | R

export class ActionMessenger<T = any, R = any> {
	private action: string

	constructor(action: string) {
		this.action = action
	}

	// Send a message and await a response of type R
	broadcast(payload?: T): Promise<R> {
		return new Promise((resolve, reject) => {
			chrome.runtime.sendMessage(
				{action: this.action, data: payload},
				(response) => {
					const err = chrome.runtime.lastError
					if (err) reject(`Error while broadcasting "${this.action}": ${err}`)
					else resolve(response as R)
				},
			)
		})
	}

	// Register a handler for this action
	catch(handler: MessageHandler<T, R>) {
		chrome.runtime.onMessage.addListener(
			(msg: {action: string; data?: any}, sender, sendResponse) => {
				if (msg.action === this.action) {
					const result = handler(msg.data as T)
					if (result instanceof Promise) {
						result.then(sendResponse).catch(console.error)
						return true // indicates async response
					} else {
						sendResponse(result)
					}
				}
			},
		)
	}
}
