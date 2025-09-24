/**
 * You need to set "action" in manifest to use this tool.
 */
export function updateBadge(count: number, color = 'black') {
	if (count > 0) {
		chrome.action.setBadgeText({text: count.toString()})
		chrome.action.setBadgeBackgroundColor({color}) // red background
	} else {
		chrome.action.setBadgeText({text: ''}) // clear badge
	}
}

/**
 * The path should be relative to root, e.g. "assets/img/icon.png"
 */
export function getURL(path: string) {
	return chrome.runtime.getURL(path)
}
