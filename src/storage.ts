// ==================== Helpers ====================
export function getLocalData<T extends Record<string, any>>(
	keys?: keyof T | (keyof T)[],
): Promise<T[keyof T] | Partial<T> | null> {
	return new Promise((resolve) => {
		chrome.storage.local.get(keys as string | string[] | null, (result) => {
			if (!keys) {
				resolve(result as Partial<T>)
			} else if (Array.isArray(keys)) {
				resolve(result as Partial<T>)
			} else {
				resolve((result[keys as string] as T[keyof T]) ?? null)
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
	keys?: keyof T | (keyof T)[],
): Promise<T[keyof T] | Partial<T> | null> {
	return new Promise((resolve) => {
		chrome.storage.sync.get(keys as string | string[] | null, (result) => {
			if (!keys) {
				resolve(result as Partial<T>)
			} else if (Array.isArray(keys)) {
				resolve(result as Partial<T>)
			} else {
				resolve((result[keys as string] as T[keyof T]) ?? null)
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
	abstract get<K extends keyof T>(
		key?: K | K[],
	): Promise<T[K] | Partial<T> | null>
	abstract set(data: Partial<T>): Promise<void>
}

/**
 * You need "storage" permission to use this tool.
 */
export class LocalStorage<
	T extends Record<string, any>,
> extends BaseStorage<T> {
	// Overload: get all
	async get(): Promise<T>
	// Overload: get single key
	async get<K extends keyof T>(key: K): Promise<T[K] | null>
	// Overload: get multiple keys
	async get<K extends keyof T>(keys: K[]): Promise<Pick<T, K>>
	// Implementation
	async get<K extends keyof T>(keyOrKeys?: K | K[]): Promise<any> {
		if (keyOrKeys === undefined) {
			const result = await getLocalData<T>()
			return result ?? ({} as T)
		}
		return getLocalData<T>(keyOrKeys as K | K[])
	}

	async set(data: Partial<T>): Promise<void> {
		return saveLocalData<T>(data)
	}
}

/**
 * You need "storage" permission to use this tool.
 */
export class SyncStorage<T extends Record<string, any>> extends BaseStorage<T> {
	// Overload: get all
	async get(): Promise<T>
	// Overload: get single key
	async get<K extends keyof T>(key: K): Promise<T[K] | null>
	// Overload: get multiple keys
	async get<K extends keyof T>(keys: K[]): Promise<Pick<T, K>>
	// Implementation
	async get<K extends keyof T>(keyOrKeys?: K | K[]): Promise<any> {
		if (keyOrKeys === undefined) {
			const result = await getSyncData<T>()
			return result ?? ({} as T)
		}
		return getSyncData<T>(keyOrKeys as K | K[])
	}

	async set(data: Partial<T>): Promise<void> {
		return saveSyncData<T>(data)
	}
}
