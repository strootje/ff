import { red } from 'chalk';
import { Arguments } from 'yargs';
import { ServerArgs } from '../../cmds/ServerCmd';
import { BottleWatcher } from '../wrappers/ChokidarWrapper';
import { CreateLogger, DebugChalkLogger } from '../wrappers/DebugChalkWrapper';

export interface CommandHandler<ArgsType extends {}> {
	(args: Arguments<ArgsType>): Promise<void>;
}

export interface CommandHandlerCallback<ArgsType extends {}> {
	(params: CommandHandlerCallbackParams<ArgsType>): Promise<void>;
}

export interface CommandHandlerCallbackParams<ArgsType extends {}> {
	args: Arguments<ArgsType>;
	logger: DebugChalkLogger;
}

export function HandleCommandAsync<ArgsType extends {}>(namespace: string, callbackAsync: CommandHandlerCallback<ArgsType>): CommandHandler<ArgsType> {
	const logger = CreateLogger(`cmds:${namespace}`);

	return async (args: Arguments<ArgsType>): Promise<void> => {
		try {
			logger('command :: %s', 'start');
			await callbackAsync({ args, logger });
			logger('command :: %s', 'finish');
		} catch (err) {
			logger('command :: %s', 'error');

			if (process.env['DEBUG']) {
				throw err;
			}

			console.error(`${red('fatal')}: ${err.message}`);
			return;
		}
	};
}

export interface ServerCommandHandlerCallback<ArgsType extends ServerArgs> {
	(params: ServerCommandHandlerCallbackParams<ArgsType>): Promise<void>;
}

export interface ServerCommandHandlerCallbackParams<ArgsType extends ServerArgs> extends CommandHandlerCallbackParams<ArgsType> {
	watcher: BottleWatcher;
}

export function HandleServerCommandAsync<ArgsType extends ServerArgs>(namespace: string, callbackAsync: ServerCommandHandlerCallback<ArgsType>): CommandHandler<ArgsType> {
	return HandleCommandAsync(namespace, async ({ args, logger }) => {
		const watcher = new BottleWatcher(args.include, {
			cwd: args.path,
			ignored: args.exclude,
			name: args.name,
			bottlesPerPage: 32
		});

		await callbackAsync({ args, logger, watcher });
	});
}
