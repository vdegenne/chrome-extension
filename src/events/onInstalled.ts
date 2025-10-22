import {DEBUG} from '../debug.js'

/**
 * Called when the extension is installed, or reloaded.
 * Not when Chrome restarts.
 */
export function addOnInstalledListener(
	callback: (details: chrome.runtime.InstalledDetails) => void,
) {
	chrome.runtime.onInstalled.addListener((details) => {
		DEBUG('onInstalled event called.')
		callback(details)
	})
}
