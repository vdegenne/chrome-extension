interface OffScreenManagerOptions {
	/**
	 * Path to the offscreen document
	 *
	 * @default '/documents/offscreen/dist/index.html'
	 */
	path: string

	/**
	 * The reason why this document needs to live.
	 *
	 * @default ["AUDIO_PLAYBACK"]
	 */
	reasons: `${chrome.offscreen.Reason}`[]

	/**
	 * Further explanation as to why those reasons were chosen
	 *
	 * @default 'Need to play alert sounds even when no UI is open'
	 */
	justification: string
}

export class OffScreenManager {
	#opts: OffScreenManagerOptions

	constructor(options?: Partial<OffScreenManagerOptions>) {
		this.#opts = {
			path: '/documents/offscreen/dist/index.html',
			reasons: ['AUDIO_PLAYBACK'],
			justification: 'Need to play alert sounds even when no UI is open',
			...options,
		}
	}

	async ensureDocument() {
		const url = chrome.runtime.getURL(this.#opts.path)
		const hasDocument = await chrome.offscreen.hasDocument()

		if (!hasDocument) {
			await chrome.offscreen.createDocument({
				url,
				reasons: this.#opts.reasons,
				justification: this.#opts.justification,
			})
		}
	}

	/**
	 * Register a function that will be called after making sure the offscreen document exists.
	 * Returns a new function that you can call normally.
	 */
	guard<F extends (...args: any[]) => any>(
		fctReference: F,
	): (...args: Parameters<F>) => Promise<ReturnType<F>> {
		return async (...args: Parameters<F>) => {
			await this.ensureDocument()
			return fctReference(...args)
		}
	}
}
