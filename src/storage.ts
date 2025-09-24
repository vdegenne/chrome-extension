// ==================== Helpers ====================
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
// ==================== Classes ====================
abstract class BaseStorage<T extends Record<string, any>> {
	abstract get<K extends keyof T>(key: K): Promise<T[K]>
	abstract get<K extends readonly (keyof T)[]>(
		...keys: K
	): Promise<{[P in K[number]]: T[P]}>
	abstract set(data: Partial<T>): Promise<void>
}

export class LocalStorage<
	T extends Record<string, any>,
> extends BaseStorage<T> {
	// overloads
	async get<K extends keyof T>(key: K): Promise<T[K]>
	async get<K extends readonly (keyof T)[]>(
		...keys: K
	): Promise<{[P in K[number]]: T[P]}>
	// implementation
	async get(...keys: (keyof T)[]): Promise<any> {
		if (keys.length === 1) {
			return getLocalData<T>(keys[0])
		}
		return getLocalData<T, typeof keys>(...keys)
	}

	async set(data: Partial<T>): Promise<void> {
		return saveLocalData<T>(data)
	}
}

export class SyncStorage<T extends Record<string, any>> extends BaseStorage<T> {
	// overloads
	async get<K extends keyof T>(key: K): Promise<T[K]>
	async get<K extends readonly (keyof T)[]>(
		...keys: K
	): Promise<{[P in K[number]]: T[P]}>
	// implementation
	async get(...keys: (keyof T)[]): Promise<any> {
		if (keys.length === 1) {
			return getSyncData<T>(keys[0])
		}
		return getSyncData<T, typeof keys>(...keys)
	}

	async set(data: Partial<T>): Promise<void> {
		return saveSyncData<T>(data)
	}
}
