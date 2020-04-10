import { gray } from 'chalk';

export class BottleNotFoundError extends Error {
	constructor(name: string) {
		super(`bottle ${gray(name)} not found`);
	}
}
