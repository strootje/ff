import { BottleInfoJson } from './BottleJson';

export interface ServerJson {
	name: string;
	pages: string[];
}

export interface ServerJsonPage {
	bottles: BottleInfoJson[];
}
