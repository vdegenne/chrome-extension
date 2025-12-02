// ==================== Helpers ====================
export function getLocalData<T extends Record<string, any>>(
	...keys: (keyof T)[]
): Promise<Partial<T>> {
	return new Promise((resolve) => {
		const query = keys.length ? (keys as string[]) : null
		chrome.storage.local.get(query, (result) => resolve(result as Partial<T>))
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
	...keys: (keyof T)[]
): Promise<Partial<T>> {
	return new Promise((resolve) => {
		const query = keys.length ? (keys as string[]) : null
		chrome.storage.sync.get(query, (result) => resolve(result as Partial<T>))
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
	/** return undefined for values not found or not yet defined */
	abstract get(): Promise<T>
	abstract get<K extends readonly (keyof T)[]>(
		...keys: K
	): Promise<{[P in K[number]]: T[P]}>

	abstract set(data: Partial<T>): Promise<void>
	abstract onChange(callback: (changes: Partial<T>) => void): void
}

export class LocalStorage<
	T extends Record<string, any>,
> extends BaseStorage<T> {
	async get(): Promise<T>
	async get<K extends readonly (keyof T)[]>(
		...keys: K
	): Promise<{[P in K[number]]: T[P]}>
	async get(...keys: (keyof T)[]): Promise<any> {
		return getLocalData<T>(...keys)
	}

	async set(data: Partial<T>): Promise<void> {
		return saveLocalData<T>(data)
	}

	onChange(callback: (changes: Partial<T>) => void) {
		chrome.storage.onChanged.addListener((changes, areaName) => {
			if (areaName !== 'local') return
			const relevant: Partial<T> = {}
			for (const key in changes)
				(relevant[key as keyof T] as any) = changes[key].newValue
			if (Object.keys(relevant).length) callback(relevant)
		})
	}
}

export class SyncStorage<T extends Record<string, any>> extends BaseStorage<T> {
	async get(): Promise<T>
	async get<K extends readonly (keyof T)[]>(
		...keys: K
	): Promise<{[P in K[number]]: T[P]}>
	async get(...keys: (keyof T)[]): Promise<any> {
		return getSyncData<T>(...keys)
	}

	async set(data: Partial<T>): Promise<void> {
		return saveSyncData<T>(data)
	}

	onChange(callback: (changes: Partial<T>) => void) {
		chrome.storage.onChanged.addListener((changes, areaName) => {
			if (areaName !== 'sync') return
			const relevant: Partial<T> = {}
			for (const key in changes)
				(relevant[key as keyof T] as any) = changes[key].newValue
			if (Object.keys(relevant).length) callback(relevant)
		})
	}
}
