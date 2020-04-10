import * as FuseJs from 'fuse.js';
import { Bottle } from '../../domain/Bottle';
import { CreateLogger } from '../wrappers/DebugChalkWrapper';
import { MapAsync } from '../wrappers/PromiseWrapper';
import { GetAllRemotesAsync, GetRemoteByNameAsync } from './RemoteRepository';
const logger = CreateLogger('infra:repositories:BottleRepository');

export interface BottleQuery {
	name: string;
	remote?: string;
	version?: string;
}

export async function FindBottlesByQuery(query: BottleQuery): Promise<Bottle[]> {
	const remotes = await (query.remote
		? GetRemoteByNameAsync(query.remote).then(p => [p])
		: GetAllRemotesAsync());
	logger('found %s usable remotes', remotes.length);

	// TODO: Filter version (SemVer)
	const bottles = await MapAsync(remotes, remote => {
		logger('- scanning %s', remote.Name);
		return remote.GetAllBottlesAsync();
	});

	const fuse = new FuseJs(bottles, {
		includeScore: true,
		keys: [
			{ name: "name", weight: .9 },
			{ name: "description", weight: .6 }
		],
		threshold: .4
	});

	const results = fuse.search(query.name);
	return results.map(p => p.item);
}
