import { SemVer } from 'semver';
import { BottleInfoJson } from 'types/BottleJson';
import { Bottle } from '../../domain/Bottle';

export function MapToBottle(json: BottleInfoJson): Bottle {
	return new Bottle(json.name, new SemVer(json.version));
}

export function MapToBottles(json: BottleInfoJson[]): Bottle[] {
	return json.map(p => MapToBottle(p));
}
