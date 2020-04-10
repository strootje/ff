import { gray } from 'chalk';
import { Remote } from '../Remote';

export class RemoteUnreachableError extends Error {
	constructor(remote: Remote) {
		super(`unable to reach remote ${gray(remote.Name)}`);
	}
}
