import {DEBUG} from '../debug.js'

interface CommandListenerOptions {
	/**
	 * If true, override existing registration for the same command+callback
	 *
	 * @default false
	 */
	force: boolean
}

const registeredCommands = new Map<string, Set<Function>>()

export function addOnCommandListener(
	commandName: string,
	callback: (tab?: chrome.tabs.Tab) => void,
	options?: Partial<CommandListenerOptions>,
) {
	const _options: CommandListenerOptions = {
		force: false,
		...options,
	}
	const callbacks = registeredCommands.get(commandName) || new Set()

	if (callbacks.has(callback)) {
		if (!_options.force) {
			throw new Error(
				`Command "${commandName}" is already registered with this callback`,
			)
		} else {
			DEBUG(`Command "${commandName}" already registered — forcing override`)
			// remove old callback first
			callbacks.delete(callback)
		}
	}

	callbacks.add(callback)
	registeredCommands.set(commandName, callbacks)

	chrome.commands.onCommand.addListener((command, tab) => {
		if (command === commandName) {
			DEBUG(`command "${commandName}" called`)
			callback(tab)
		}
	})
}
