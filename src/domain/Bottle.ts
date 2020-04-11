import { SemVer } from 'semver';
import { Step } from './Step';

export class Bottle {
	public constructor(
		private readonly name: string,
		private readonly version: SemVer
	) {
	}

	public get Name(): string { return this.name; }
	public get Version(): SemVer { return this.version; }

	public GetStepsAsync(): Promise<Step[]> {
		return new Promise(done => {
			setTimeout(() => done([]), 5000);
		})
	}
}
