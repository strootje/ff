import { existsSync, readFileSync } from 'fs';

interface CacheStore {
	data: { [key: string]: unknown };
}

const store: CacheStore = {
	data: {}
};

export function ResetCacheStore(): void {
	store.data = {};
}

export interface CacheCallback<T> {
	(): T;
}

export function GetFromCache<T>(key: string, builder: CacheCallback<T>): T {
	if (!store.data[key]) {
		store.data[key] = builder();
	}

	return store.data[key] as T;
}

export function GetJsonFromCache<T extends {}>(file: string, initial: T): T {
	return GetFromCache(`json:${file}`, () => {
		if (!existsSync(file)) {
			return initial;
		}

		const raw = readFileSync(file, 'utf-8');
		const json = JSON.parse(raw)
		return json as T;
	});
}

export function DeleteFromCache(key: string): void {
	if (store.data[key]) {
		delete store.data[key];
	}
}

export function DeleteJsonFromCache(file: string): void {
	DeleteFromCache(`json:${file}`);
}
