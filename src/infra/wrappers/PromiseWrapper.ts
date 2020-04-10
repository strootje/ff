export function ReduceAsync<T>(promises: Promise<T[]>[]): Promise<T[]> {
	return Promise.all(promises).then(lists => lists.reduce<T[]>((prev, cur) => [...prev, ...cur], []));
}

export interface MapAsyncCallback<Tin, Tout> {
	(item: Tin): Promise<Tout[]>;
}

export function MapAsync<Tin, Tout>(list: Tin[], callback: MapAsyncCallback<Tin, Tout>): Promise<Tout[]> {
	const promises = list.map(p => callback(p));
	return ReduceAsync(promises);
}
