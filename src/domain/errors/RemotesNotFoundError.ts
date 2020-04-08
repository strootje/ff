export class RemotesNotFoundError extends Error {
	constructor() {
		super('no remotes found');
	}
}
