import * as FindUpAsync from 'find-up';
import { writeFile } from 'fs';
import { homedir } from 'os';
import { promisify } from 'util';
import { ConfigJson } from '../../types/ConfigJson';
import { DeleteJsonFromCache, GetFromCache, GetJsonFromCache } from '../cache/MemoryCache';
const WriteFileAsync = promisify(writeFile);

const filenames = ['.ffrc', '.ffrc.json'];
function GetConfigPathAsync(): Promise<string> {
	return GetFromCache('config-path', async () => {
		let path = await FindUpAsync(filenames);

		if (!path) {
			path = await FindUpAsync(filenames, {
				cwd: homedir()
			});
		}

		if (!path) {
			path = `${homedir()}/.ffrc`;
		}

		return path;
	});
}

export async function GetConfigAsync(): Promise<Readonly<ConfigJson>> {
	const path = await GetConfigPathAsync();

	return GetJsonFromCache<ConfigJson>(path, {
		remotes: []
	});
}

export async function UpdateConfigAsync(mutator: (config: Readonly<ConfigJson>) => void): Promise<void> {
	const path = await GetConfigPathAsync();
	const config = await GetConfigAsync();

	const json = mutator(config);
	const raw = JSON.stringify(json);
	await WriteFileAsync(path, raw, 'utf-8');
	DeleteJsonFromCache(path);
}
