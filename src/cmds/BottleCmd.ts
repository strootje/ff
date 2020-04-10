import { Argv, CommandModule, showHelp } from 'yargs';
import { BottleQueryInvalidError } from '../domain/errors/QueryInvalidError';
import { BottleQuery } from '../infra/repositories/BottleRepository';
import { AddBottleCmd } from './bottle/AddBottleCmd';
import { FindBottleCmd } from './bottle/FindBottleCmd';

export interface BottleArgs {
	query: string;
	remote?: string;
	version?: string;
}

export const BottleCmd: CommandModule<{}, {}> = {
	command: ['bottle', '$0'],

	handler: () => showHelp(),
	builder: yargs => yargs.help()
		.command(AddBottleCmd)
		.command(FindBottleCmd)
		.demandCommand()
};

export function ParseBottleArgs(args: Argv<{}>): Argv<BottleArgs> {
	return args.help()
		.positional('query', {
			type: 'string',
			demandOption: true
		})
		.option('remote', {
			type: 'string'
		})
		.option('version', {
			type: 'string'
		});
}

export function ParseQuery(args: BottleArgs): BottleQuery {
	const matches = args.query.match(/^((?<remote>[\w\d-_\.]+)\/)?(?<name>[\w\d-_\.]+)(\@(?<version>[\w\d-_\.\>\<\~\*]+))?$/i);

	if (!matches || !matches.groups || !matches.groups.name) {
		throw new BottleQueryInvalidError(args.query);
	}

	return {
		name: matches.groups.name,
		remote: args.remote || matches.groups.remote,
		version: args.version || matches.groups.version
	};
}
