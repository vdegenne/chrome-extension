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

/**
 * This function works without "tabs" permission.
 * But "tabs" permission can help getting more information about a specific tab.
 */
export async function getCurrentTab() {
	const tabs = await chrome.tabs.query({active: true, currentWindow: true})
	if (!tabs || tabs.length === 0) return null
	return tabs[0]
}

export function openOptionsPage() {
	return chrome.runtime.openOptionsPage()
}
