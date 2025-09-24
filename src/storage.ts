// ==================== Helpers ====================
export function getLocalData<
	T extends Record<string, any>,
	K extends readonly (keyof T)[] = [],
>(
	...keys: K
): Promise<
	K['length'] extends 0
		? {[P in keyof T]: T[P] | null}
		: {[P in K[number]]: T[P] | null}
> {
	return new Promise((resolve) => {
		const query = keys.length ? (keys as unknown as string[]) : null
		chrome.storage.local.get(query, (result) => {
			if (!keys.length) {
				resolve(result as {[P in keyof T]: T[P] | null})
			} else {
				const mapped: any = {}
				keys.forEach((k) => (mapped[k] = result[k as string] ?? null))
				resolve(mapped)
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

export function getSyncData<
	T extends Record<string, any>,
	K extends readonly (keyof T)[] = [],
>(
	...keys: K
): Promise<
	K['length'] extends 0
		? {[P in keyof T]: T[P] | null}
		: {[P in K[number]]: T[P] | null}
> {
	return new Promise((resolve) => {
		const query = keys.length ? (keys as unknown as string[]) : null
		chrome.storage.sync.get(query, (result) => {
			if (!keys.length) {
				resolve(result as {[P in keyof T]: T[P] | null})
			} else {
				const mapped: any = {}
				keys.forEach((k) => (mapped[k] = result[k as string] ?? null))
				resolve(mapped)
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
	): Promise<
		K['length'] extends 0
			? {[P in keyof T]: T[P] | null}
			: {[P in K[number]]: T[P] | null}
	>

	abstract set(data: Partial<T>): Promise<void>
}
/**
 * You need "storage" permission to use this tool.
 */
export class LocalStorage<
	T extends Record<string, any>,
> extends BaseStorage<T> {
	async get<K extends readonly (keyof T)[]>(
		...keys: K
	): Promise<
		K['length'] extends 0
			? {[P in keyof T]: T[P] | null}
			: {[P in K[number]]: T[P] | null}
	> {
		if (keys.length === 0) {
			const result = await getLocalData<T>()
			return result
		}
		return getLocalData<T, K>(...keys)
	}

	async set(data: Partial<T>): Promise<void> {
		return saveLocalData<T>(data)
	}
}

export class SyncStorage<T extends Record<string, any>> extends BaseStorage<T> {
	async get<K extends readonly (keyof T)[]>(
		...keys: K
	): Promise<
		K['length'] extends 0
			? {[P in keyof T]: T[P] | null}
			: {[P in K[number]]: T[P] | null}
	> {
		if (keys.length === 0) {
			const result = await getSyncData<T>()
			return result
		}
		return getSyncData<T, K>(...keys)
	}

	async set(data: Partial<T>): Promise<void> {
		return saveSyncData<T>(data)
	}
}
