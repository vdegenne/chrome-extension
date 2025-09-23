export function addOnInstalledListener(
	callback: (details: chrome.runtime.InstalledDetails) => void,
) {
	chrome.runtime.onInstalled.addListener(callback);
}
