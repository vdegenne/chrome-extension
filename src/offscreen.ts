export async function ensureOffscreenDocument() {
	// Check if offscreen document already exists
	const url = chrome.runtime.getURL('offscreen.html')
	const hasDocument = await chrome.offscreen.hasDocument()

	if (!hasDocument) {
		await chrome.offscreen.createDocument({
			url,
			reasons: ['AUDIO_PLAYBACK'],
			justification: 'Need to play alert sounds even when no UI is open',
		})
	}
}
