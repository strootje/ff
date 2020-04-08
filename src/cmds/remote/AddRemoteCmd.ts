import { CommandModule } from 'yargs';
import { Remote } from '../../domain/Remote';
import { HandleCommandAsync } from '../../infra/handlers/CommandHandlers';
import { AddRemoteAsync } from '../../infra/repositories/RemoteRepository';
import { ParseRemoteArgs, RemoteArgs } from '../RemoteCmd';

export interface AddRemoteArgs extends RemoteArgs {
	path: string;
}

export const AddRemoteCmd: CommandModule<{}, AddRemoteArgs> = {
	command: 'add <name> <path>',

	builder: yargs => ParseRemoteArgs(yargs)
		.positional('path', {
			type: 'string',
			demandOption: true
		}),

	handler: HandleCommandAsync('AddRemoteCmd', ({ args }) => {
		return AddRemoteAsync(new Remote(args.name, args.path));
	})
};
