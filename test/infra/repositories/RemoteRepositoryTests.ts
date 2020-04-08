import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { GetFromCache } from '../../../src/infra/cache/MemoryCache';
import { GetAllRemotesAsync } from '../../../src/infra/repositories/RemoteRepository';
import { RemoteJson } from '../../../src/types/RemoteJson';
import { TestBase } from '../../_utils/TestBase';

@suite
export class RemoteRepositoryTests extends TestBase {
	@test
	public async GetAllRemotesAsync_EmptyConfig_ShouldReturnEmptyList(): Promise<void> {
		// Arrange
		// ..

		// Act
		const remotes = GetAllRemotesAsync();

		// Assert
		await expect(remotes).to.eventually.be.empty;
	}

	@test
	public async GetAllRemotesAsync_InitializedConfig_ShouldReturnListOfRemotes(): Promise<void> {
		// Arrange
		const remoteJson: RemoteJson = { name: 'testing', path: 'http://testing' };
		const configpath = GetFromCache('config-path', () => `${process.cwd()}/.ffrc`);
		GetFromCache(`json:${configpath}`, () => ({ remotes: [remoteJson] }));

		// Act
		const remotes = await GetAllRemotesAsync();

		// Assert
		expect(remotes).to.not.be.empty;
		expect(remotes[0]).to.have.property('Name').which.equals(remoteJson.name);
		expect(remotes[0]).to.have.property('Path').which.equals(remoteJson.path);
	}
}
