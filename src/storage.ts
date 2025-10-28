// ==================== Helpers ====================
export function getLocalData<T extends Record<string, any>>(): Promise<T>
export function getLocalData<T extends Record<string, any>>(
	key: keyof T,
): Promise<T[typeof key]>
export function getLocalData<
	T extends Record<string, any>,
	K extends readonly (keyof T)[],
>(...keys: K): Promise<{[P in K[number]]: T[P]}>
export function getLocalData<
	T extends Record<string, any>,
	K extends readonly (keyof T)[],
>(...keys: K | [keyof T]): Promise<any> {
	return new Promise((resolve) => {
		const query =
			keys.length === 1 && typeof keys[0] === 'string'
				? (keys[0] as string)
				: keys.length
					? (keys as unknown as string[])
					: null
		chrome.storage.local.get(query, (result) => {
			if (keys.length === 1 && typeof keys[0] === 'string') {
				resolve(result[keys[0] as string])
			} else {
				resolve(result)
			}
		})
	})
}

export function saveLocalData<T extends Record<string, any>>(
	data: Partial<T>,
): Promise<void> {
	return new Promise((resolve) => {
		chrome.storage.local.set(data as Record<string, any>, () => resolve())
	})
}

export function getSyncData<T extends Record<string, any>>(): Promise<T>
export function getSyncData<T extends Record<string, any>>(
	key: keyof T,
): Promise<T[typeof key]>
export function getSyncData<
	T extends Record<string, any>,
	K extends readonly (keyof T)[],
>(...keys: K): Promise<{[P in K[number]]: T[P]}>
export function getSyncData<
	T extends Record<string, any>,
	K extends readonly (keyof T)[],
>(...keys: K | [keyof T]): Promise<any> {
	return new Promise((resolve) => {
		const query =
			keys.length === 1 && typeof keys[0] === 'string'
				? (keys[0] as string)
				: keys.length
					? (keys as unknown as string[])
					: null
		chrome.storage.sync.get(query, (result) => {
			if (keys.length === 1 && typeof keys[0] === 'string') {
				resolve(result[keys[0] as string])
			} else {
				resolve(result)
			}
		})
	})
}

export function saveSyncData<T extends Record<string, any>>(
	data: Partial<T>,
): Promise<void> {
	return new Promise((resolve) => {
		chrome.storage.sync.set(data as Record<string, any>, () => resolve())
	})
}

// ==================== Classes ====================
abstract class BaseStorage<T extends Record<string, any>> {
	abstract get<K extends readonly (keyof T)[]>(
		...keys: K
	): Promise<{[P in K[number]]: T[P]}>

	abstract set(data: Partial<T>): Promise<void>
	abstract onChange(callback: (changes: Partial<T>) => void): void
}

export class LocalStorage<
	T extends Record<string, any>,
> extends BaseStorage<T> {
	async get<K extends readonly (keyof T)[]>(
		...keys: K
	): Promise<{[P in K[number]]: T[P]}> {
		if (keys.length === 0) return getLocalData<T>()
		return getLocalData<T, K>(...keys)
	}

	async set(data: Partial<T>): Promise<void> {
		return saveLocalData<T>(data)
	}

	onChange(callback: (changes: Partial<T>) => void) {
		chrome.storage.onChanged.addListener((changes, areaName) => {
			if (areaName !== 'local') return

			const relevant: Partial<T> = {}
			for (const key in changes) {
				relevant[key as keyof T] = changes[key].newValue
			}
			if (Object.keys(relevant).length) callback(relevant)
		})
	}
}

export class SyncStorage<T extends Record<string, any>> extends BaseStorage<T> {
	async get<K extends readonly (keyof T)[]>(
		...keys: K
	): Promise<{[P in K[number]]: T[P]}> {
		if (keys.length === 0) return getSyncData<T>()
		return getSyncData<T, K>(...keys)
	}

	async set(data: Partial<T>): Promise<void> {
		return saveSyncData<T>(data)
	}

	onChange(callback: (changes: Partial<T>) => void) {
		chrome.storage.onChanged.addListener((changes, areaName) => {
			if (areaName !== 'sync') return

			const relevant: Partial<T> = {}
			for (const key in changes) {
				relevant[key as keyof T] = changes[key].newValue
			}
			if (Object.keys(relevant).length) callback(relevant)
		})
	}
}
