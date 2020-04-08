import { Remote } from '../../domain/Remote';
import { RemoteJson } from '../../types/RemoteJson';

export function MapToRemote(json: Readonly<RemoteJson>): Remote {
	return new Remote(json.name, json.path);
}

export function MapToRemotes(json: Readonly<RemoteJson>[]): Remote[] {
	return json.map(p => MapToRemote(p));
}

export function MapRemoteToJson(remote: Remote): Readonly<RemoteJson> {
	return {
		name: remote.Name,
		path: remote.Path
	};
}
