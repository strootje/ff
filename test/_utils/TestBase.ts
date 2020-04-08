import { use } from 'chai';
import * as ChaiAsPromised from 'chai-as-promised';
import { ResetCacheStore } from '../../src/infra/cache/MemoryCache';

export abstract class TestBase {
	public before(): void {
		use(ChaiAsPromised);
		ResetCacheStore();
	}
}
