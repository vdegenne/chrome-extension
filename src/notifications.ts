import {getURL} from './misc.js'

/**
 * You need "notifications" permission to use this tool.
 */
export function createNotification(
	title: string,
	message: string,
	iconPath: string,
	type: chrome.notifications.TemplateType = chrome.notifications.TemplateType
		.BASIC,
) {
	chrome.notifications.create({
		type,
		title,
		message,
		iconUrl: getURL(iconPath),
	})
}
