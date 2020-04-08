import { RemoteConflictError } from '../../domain/errors/RemoteConflictError';
import { RemoteNotFoundError } from '../../domain/errors/RemoteNotFoundError';
import { Remote } from '../../domain/Remote';
import { RemoteJson } from '../../types/RemoteJson';
import { MapRemoteToJson, MapToRemote, MapToRemotes } from '../mappers/RemoteMapper';
import { GetConfigAsync, UpdateConfigAsync } from './ConfigRepository';

async function FindRemoteJsonByNameAsync(name: string): Promise<RemoteJson | undefined> {
	const config = await GetConfigAsync();
	return config.remotes.find(p => p.name === name);

}

export async function GetAllRemotesAsync(): Promise<Remote[]> {
	const config = await GetConfigAsync();
	return MapToRemotes(config.remotes);
}

export async function GetRemoteByNameAsync(name: string): Promise<Remote> {
	const remote = await FindRemoteJsonByNameAsync(name);

	if (!remote) {
		throw new RemoteNotFoundError(name);
	}

	return MapToRemote(remote);
}

export async function AddRemoteAsync(remote: Remote): Promise<void> {
	const json = await FindRemoteJsonByNameAsync(remote.Name);

	if (!!json) {
		throw new RemoteConflictError(remote.Name);
	}

	await UpdateConfigAsync(p => ({
		remotes: [...p.remotes, MapRemoteToJson(remote)]
	}));
}

export async function DeleteRemoteByNameAsync(name: string): Promise<void> {
	const remote = await GetRemoteByNameAsync(name);

	await UpdateConfigAsync(p => ({
		remotes: p.remotes.filter(r => r.name != remote.Name)
	}))
}
