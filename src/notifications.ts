/**
 * You need "notifications" permission to use this tool.
 */
export function createNotification(
	title: string,
	message: string,
	iconUrl: string,
	type: chrome.notifications.TemplateType = chrome.notifications.TemplateType
		.BASIC,
) {
	chrome.notifications.create({
		type,
		title,
		message,
		iconUrl,
	})
}
