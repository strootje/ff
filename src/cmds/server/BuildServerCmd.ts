import { writeFile } from 'fs';
import * as MkdirpAsync from 'mkdirp';
import { dirname, resolve } from 'path';
import { promisify } from 'util';
import { CommandModule } from 'yargs';
import { HandleServerCommandAsync } from '../../infra/handlers/CommandHandlers';
import { CreateEventSpinnerAsync } from '../../infra/wrappers/OraChalkWrapper';
import { ParseServerArgs, ServerArgs } from '../ServerCmd';
const WriteFileAsync = promisify(writeFile);

export interface BuildServerArgs extends ServerArgs {
	out: string;
}

export const BuildServerCmd: CommandModule<{}, BuildServerArgs> = {
	command: 'build [path]',

	builder: yargs => ParseServerArgs(yargs)
		.option('out', {
			type: 'string',
			default: resolve(process.cwd(), 'dist')
		}),

	handler: HandleServerCommandAsync('BuildServerCmd', ({ args, watcher }) => CreateEventSpinnerAsync(writeLine => new Promise((done, fatal) => {
		watcher.on('ready', () => watcher.close().finally(done));
		watcher.on('error', err => watcher.close().finally(() => fatal(err)));
		watcher.on('update', async ({ filename, json }) => {
			const path = resolve(args.out, filename);
			writeLine('writing to %s', path);
			await MkdirpAsync(dirname(path));
			await WriteFileAsync(path, JSON.stringify(json), 'utf-8');
		});
	})))
};
