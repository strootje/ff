import { Argv, CommandModule, showHelp } from 'yargs';
import { AddRemoteCmd } from './remote/AddRemoteCmd';
import { DelRemoteCmd } from './remote/DelRemoteCmd';
import { InfoRemoteCmd } from './remote/InfoRemoteCmd';

export interface RemoteArgs {
	name: string;
}

export const RemoteCmd: CommandModule<{}, {}> = {
	command: 'remote',

	handler: () => showHelp(),
	builder: yargs => yargs.help()
		.command(AddRemoteCmd)
		.command(DelRemoteCmd)
		.command(InfoRemoteCmd)
		.demandCommand()
};

export function ParseRemoteArgs(args: Argv<{}>): Argv<RemoteArgs> {
	return args.help()
		.positional('name', {
			type: 'string',
			demandOption: true
		});
}
