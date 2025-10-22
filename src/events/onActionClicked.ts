import {DEBUG} from '../debug.js'

/**
 * Called when the extension badge is click in the toolbar.
 * It only works if you set `"action"` in the manifest
 * Not when Chrome restarts.
 */
export function addOnActionClickedListener(
	callback: (tab: chrome.tabs.Tab) => void,
) {
	chrome.action.onClicked.addListener((tab) => {
		if (DEBUG()) {
			console.log('action.onClicked event called.')
		}
		callback(tab)
	})
}
