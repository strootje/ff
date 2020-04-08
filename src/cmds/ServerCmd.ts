import { hostname } from 'os';
import { Argv, CommandModule, showHelp } from 'yargs';
import { BuildServerCmd } from './server/BuildServerCmd';
import { ServeServerCmd } from './server/ServeServerCmd';

export interface ServerArgs {
	path: string;
	name: string;
	include: string;
	remote?: string;
	exclude?: string;
}

export const ServerCmd: CommandModule<{}, {}> = {
	command: 'server',

	handler: () => showHelp(),
	builder: yargs => yargs.help()
		.command(BuildServerCmd)
		.command(ServeServerCmd)
		.demandCommand()
};

export function ParseServerArgs(args: Argv<{}>): Argv<ServerArgs> {
	return args.help()
		.positional('path', {
			type: 'string',
			default: process.cwd()
		})
		.option('name', {
			type: 'string',
			default: hostname()
		})
		.option('include', {
			type: 'string',
			default: '**/*.json'
		})
		.option('remote', {
			type: 'string'
		})
		.option('exclude', {
			type: 'string'
		});
}
