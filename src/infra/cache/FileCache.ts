import { CacheCallback } from './MemoryCache';

export function GetFromCache<T>(key: string, builder: CacheCallback<T>): T {
	console.log(`cache for ${key}`);
	return builder();
}
