/**
 * You need "offscreen" permission to use this tool.
 * @deprecated Use offscreen manager instead.
 */
export async function ensureOffscreenDocument(
	options: {
		path?: string
		reasons?: `${chrome.offscreen.Reason}`[]
		justification?: string
	} = {},
) {
	// Check if offscreen document already exists
	const url = chrome.runtime.getURL(
		options.path ?? '/documents/offscreen/offscreen.html',
	)
	const hasDocument = await chrome.offscreen.hasDocument()

	if (!hasDocument) {
		await chrome.offscreen.createDocument({
			url,
			reasons: options.reasons ?? ['AUDIO_PLAYBACK'],
			justification:
				options.justification ??
				'Need to play alert sounds even when no UI is open',
		})
	}
}
