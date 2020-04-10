import Axios from 'axios';
import { MapToBottles } from '../infra/mappers/BottleMapper';
import { CreateLogger } from '../infra/wrappers/DebugChalkWrapper';
import { MapAsync } from '../infra/wrappers/PromiseWrapper';
import { BottleInfoJson } from '../types/BottleJson';
import { ServerJson } from '../types/ServerJson';
import { Bottle } from './Bottle';
import { RemoteUnreachableError } from './errors/RemoteUnreachableError';
const logger = CreateLogger('domain:Remote');

export class Remote {
	public constructor(
		private readonly name: string,
		private readonly path: string
	) {
	}

	public get Name(): string { return this.name; }
	public get Path(): string { return this.path; }

	public async GetAllBottlesAsync(): Promise<Bottle[]> {
		const index = await this.GetAsync<ServerJson>('index.json');
		const bottles = await MapAsync(index.pages, page => this.GetAsync<BottleInfoJson[]>(page));

		return MapToBottles(bottles);
	}

	private async GetAsync<T extends {}>(path: string): Promise<T> {
		logger('calling %s/%s', this.Name, path);
		const fullpath = `${this.Path}/${path}`;

		try {
			const json = await Axios.get<T>(fullpath);
			return json.data;
		} catch (err) {
			if (process.env['DEBUG']) {
				throw err;
			}

			throw new RemoteUnreachableError(this);
		}
	}
}
