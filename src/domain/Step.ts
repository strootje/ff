export abstract class Step {
	constructor(
		private readonly title: string
	) {
	}

	public get Title(): string { return this.title; }

	public abstract RunAsync(): Promise<void>;
}
