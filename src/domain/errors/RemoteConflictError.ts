import { gray } from 'chalk';

export class RemoteConflictError extends Error {
	constructor(name: string) {
		super(`remote ${gray(name)} already exists`);
	}
}
