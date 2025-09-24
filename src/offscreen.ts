/**
 * You need "offscreen" permission to use this tool.
 */
export async function ensureOffscreenDocument(
	path = 'documents/offscreen/offscreen.html',
) {
	// Check if offscreen document already exists
	const url = chrome.runtime.getURL(path)
	const hasDocument = await chrome.offscreen.hasDocument()

	if (!hasDocument) {
		await chrome.offscreen.createDocument({
			url,
			reasons: ['AUDIO_PLAYBACK'],
			justification: 'Need to play alert sounds even when no UI is open',
		})
	}
}
