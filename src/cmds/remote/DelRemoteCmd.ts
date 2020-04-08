import { CommandModule } from 'yargs';
import { HandleCommandAsync } from '../../infra/handlers/CommandHandlers';
import { DeleteRemoteByNameAsync } from '../../infra/repositories/RemoteRepository';
import { ParseRemoteArgs, RemoteArgs } from '../RemoteCmd';

export const DelRemoteCmd: CommandModule<{}, RemoteArgs> = {
	command: 'del <name>',

	builder: yargs => ParseRemoteArgs(yargs),

	handler: HandleCommandAsync('DelRemoteCmd', ({ args }) => {
		return DeleteRemoteByNameAsync(args.name);
	})
};
