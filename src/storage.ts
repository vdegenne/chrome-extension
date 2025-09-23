export function getLocalData<T>(key: string): Promise<T | null> {
	return new Promise((resolve) => {
		chrome.storage.local.get(key, (result) => {
			resolve((result[key] as T) ?? null);
		});
	});
}

export function saveLocalData<T>(key: string, value: T): Promise<void> {
	return new Promise((resolve) => {
		chrome.storage.local.set({[key]: value}, () => resolve());
	});
}

export function getSyncData<T>(key: string): Promise<T | null> {
	return new Promise((resolve) => {
		chrome.storage.sync.get(key, (result) => {
			resolve((result[key] as T) ?? null);
		});
	});
}

export function saveSyncData<T>(key: string, value: T): Promise<void> {
	return new Promise((resolve) => {
		chrome.storage.sync.set({[key]: value}, () => resolve());
	});
}
