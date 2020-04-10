import { cyan } from 'chalk';
import { CommandModule } from 'yargs';
import { HandleCommandAsync } from '../../infra/handlers/CommandHandlers';
import { FindBottlesByQuery } from '../../infra/repositories/BottleRepository';
import { AsTable, Highlight } from '../../infra/wrappers/ConsoleLogWrapper';
import { BottleArgs, ParseBottleArgs, ParseQuery } from '../BottleCmd';

export const FindBottleCmd: CommandModule<{}, BottleArgs> = {
	command: 'find <query>',

	builder: yargs => ParseBottleArgs(yargs),

	handler: HandleCommandAsync('AddBottleCmd', async ({ args }) => {
		const query = ParseQuery(args);
		const bottles = await FindBottlesByQuery(query);

		console.log(Highlight(AsTable(bottles), {
			[query.name]: cyan
		}));
	})
};
