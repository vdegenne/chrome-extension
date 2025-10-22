import {DEBUG} from '../debug.js'

/**
 * Called when the extension badge is clicked in the toolbar.
 * It only works if you set `"action"` in the manifest (or else throw an error).
 * If you set "default_popup" in the manifest's "action" block, the error is not throw but
 * the listener is not called neither.
 */
export function addOnActionClickedListener(
	callback: (tab: chrome.tabs.Tab) => void,
) {
	chrome.action.onClicked.addListener((tab) => {
		DEBUG('action.onClicked event called')
		callback(tab)
	})
}
