import { CommandModule } from 'yargs';
import { RemotesNotFoundError } from '../domain/errors/RemotesNotFoundError';
import { HandleCommandAsync } from '../infra/handlers/CommandHandlers';
import { GetAllRemotesAsync } from '../infra/repositories/RemoteRepository';
import { PrintAsTable } from '../infra/wrappers/ConsoleLogWrapper';

export const RemotesCmd: CommandModule = {
	command: 'remotes',

	handler: HandleCommandAsync('RemotesCmd', async () => {
		const remotes = await GetAllRemotesAsync();

		if (remotes.length < 1) {
			throw new RemotesNotFoundError();
		}

		PrintAsTable(remotes);
	})
};

