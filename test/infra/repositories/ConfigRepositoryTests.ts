import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { GetFromCache } from '../../../src/infra/cache/MemoryCache';
import { GetConfigAsync } from '../../../src/infra/repositories/ConfigRepository';
import { RemoteJson } from '../../../src/types/RemoteJson';
import { TestBase } from '../../_utils/TestBase';

@suite
export class ConfigRepositoryTests extends TestBase {
	@test
	public async GetConfigAsync_EmptyConfig_ShouldReturnInitialConfig(): Promise<void> {
		// Arrange
		// ..

		// Act
		const config = GetConfigAsync();

		// Assert
		await expect(config).to.eventually.have.property('remotes').which.is.empty;
	}

	@test
	public async GetConfigAsync_ConfigWithOneRemote_ShouldReturnTheCorrectConfig(): Promise<void> {
		// Arrange
		const remote: RemoteJson = { name: 'testing', path: 'http://testing' };
		const configpath = GetFromCache('config-path', () => `${process.cwd()}/.ffrc`);
		GetFromCache(`json:${configpath}`, () => ({ remotes: [remote] }));

		// Act
		const config = GetConfigAsync();

		// Assert
		await expect(config).to.eventually.have.property('remotes').which.include(remote);
	}
}
