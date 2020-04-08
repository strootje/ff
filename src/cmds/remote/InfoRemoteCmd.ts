import { CommandModule } from 'yargs';
import { HandleCommandAsync } from '../../infra/handlers/CommandHandlers';
import { GetRemoteByNameAsync } from '../../infra/repositories/RemoteRepository';
import { PrintAsKeyValue } from '../../infra/wrappers/ConsoleLogWrapper';
import { ParseRemoteArgs, RemoteArgs } from '../RemoteCmd';

export const InfoRemoteCmd: CommandModule<{}, RemoteArgs> = {
	command: 'info <name>',

	builder: yargs => ParseRemoteArgs(yargs),

	handler: HandleCommandAsync('InfoRemoteCmd', async ({ args }) => {
		const remote = await GetRemoteByNameAsync(args.name);
		PrintAsKeyValue(remote);
	})
};
