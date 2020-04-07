import * as Express from 'express';
import { CommandModule } from 'yargs';
import { HandleServerCommandAsync } from '../../infra/handlers/CommandHandlers';
import { CreateSpinnerAsync } from '../../infra/wrappers/OraChalkWrapper';
import { ParseServerArgs, ServerArgs } from '../ServerCmd';

export interface ServeServerArgs extends ServerArgs {
	host: string;
	port: number;
}

interface ListOfFiles {
	[key: string]: {};
}

export const ServeServerCmd: CommandModule<{}, ServeServerArgs> = {
	command: 'serve [path]',

	builder: yargs => ParseServerArgs(yargs)
		.option('host', {
			type: 'string',
			default: '0.0.0.0'
		})
		.option('port', {
			type: 'number',
			default: 1415
		}),

	handler: HandleServerCommandAsync('ServeServerCmd', ({ args, watcher }) => CreateSpinnerAsync(update => new Promise((done, fatal) => {
		const files: ListOfFiles = {};
		const server = Express();

		watcher.on('error', err => watcher.close().finally(() => fatal(err)));
		watcher.on('ready', () => {
			const listener = server.listen(args.port, args.host, () => {
				update('-----');
				update('serving %s from http://%s:%s/index.json', args.name, args.host, args.port);
				update('-----');
			});

			listener.on('close', () => done(watcher.close()));
		});

		watcher.on('update', ({ filename, json }) => {
			if (!!files[filename]) {
				update('detected %s for %s', 'update', filename);
				files[filename] = json;
			} else {
				update('detected %s for %s', 'add', filename);
				files[filename] = json;

				server.get(`/${filename}`, (_, res) => {
					if (!files[filename]) {
						res.status(404).end();
					} else {
						res.json(files[filename]);
					}
				});
			}

		});

		watcher.on('delete', ({ filename }) => {
			delete files[filename];
			update('detected %s for %s', 'delete', filename);
		});
	})))
};
