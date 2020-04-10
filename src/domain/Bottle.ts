import { SemVer } from 'semver';

export class Bottle {
	public constructor(
		private readonly name: string,
		private readonly version: SemVer
	) {
	}

	public get Name(): string { return this.name; }
	public get Version(): SemVer { return this.version; }
}
