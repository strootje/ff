export class Remote {
	public constructor(
		private readonly name: string,
		private readonly path: string
	) {
	}

	public get Name(): string { return this.name; }
	public get Path(): string { return this.path; }
}
