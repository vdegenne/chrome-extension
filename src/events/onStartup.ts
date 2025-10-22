import {DEBUG} from '../debug.js'

/**
 * Called when Chrome restarts.
 */
export function addOnStartupListener(callback: () => void) {
	chrome.runtime.onStartup.addListener(() => {
		DEBUG('onStartup event called.')
		callback()
	})
}
