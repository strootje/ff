export interface BottleInfoJson {
	name: string;
	version: string;
	tags: string[];
}

export type BottleJson = BottleInfoJson & {
};
