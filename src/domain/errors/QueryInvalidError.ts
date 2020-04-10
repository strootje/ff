import { gray } from 'chalk';

export class BottleQueryInvalidError extends Error {
	constructor(query: string) {
		super(`query ${gray(query)} is invalid`);
	}
}
