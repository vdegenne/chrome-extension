interface InstallSidePanelOptions {
	/**
	 * A list of domains where the sidepanel will only open on.
	 *
	 * Use undefined to completely ignore it and add
	 * ```json
	 * "side_panel": {
	 *   "default_path": "/documents/sidepanel/dist/index.html"
	 * }
	 * ```
	 * to your manifest to make the sidepanel available everywhere.
	 *
	 * @default undefined
	 */
	filter: string[] | undefined

	/**
	 * Whether to show the sidepanel when the action icon is clicked.
	 *
	 * @default false
	 */
	action: boolean

	/**
	 * @default '/documents/sidepanel/dist/index.html'
	 */
	sidePanelLocation: string
}

/**
 * You need to use "sidePanel" permission to use this.
 *
 * If you set `action` option to true (to make the action icon interactable.)
 * You also need to add the following in your manifest:
 *
 * ```json
 * "action": {
 *   "default_title": "Click to open panel"
 * }
 * ````
 *
 * From here you have two options:
 *
 * - Use a global sidepanel:
 *
 *   Just add "side_panel" field in the manifest to specify the location of the side panel (e.g. /documents/sidepanel/dist/index.html)
 *
 *
 * - Use a site-specific sidepanels:
 *
 *     - You need "tabs" permission for this option.
 *     - Use `filter` option to specify the sites.
 *     - Do not forget to remove "side_panel" field in the manifest.
 *
 */
export function installSidePanel(options?: Partial<InstallSidePanelOptions>) {
	const _options: InstallSidePanelOptions = {
		filter: undefined,
		action: false,
		sidePanelLocation: '/documents/sidepanel/dist/index.html',
		...options,
	}

	if (_options.action) {
		// This safe to use without "tabs" permission, tab.id is public
		// chrome.action.onClicked.addListener((tab) => {
		// 	if (tab.id === undefined) return
		// 	chrome.sidePanel.open({tabId: tab.id}).catch(console.error)
		// })
		chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true})
	}

	if (_options.filter !== undefined && _options.filter.length) {
		chrome.tabs.onUpdated.addListener(async (tabId, _info, tab) => {
			if (!tab.url) return // only run when URL changed
			const url = new URL(tab.url)

			if (_options.filter!.some((u) => new URL(u).origin === url.origin)) {
				await chrome.sidePanel.setOptions({
					tabId,
					path: _options.sidePanelLocation,
					enabled: true,
				})
			} else {
				await chrome.sidePanel.setOptions({
					tabId,
					enabled: false,
				})
			}
		})
	}
}
