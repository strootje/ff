import { gray } from 'chalk';

export class RemoteNotFoundError extends Error {
	constructor(name: string) {
		super(`remote ${gray(name)} not found`);
	}
}
