import { CommandModule } from 'yargs';
import { BottleNotFoundError } from '../../domain/errors/BottleNotFoundError';
import { HandleCommandAsync } from '../../infra/handlers/CommandHandlers';
import { FindBottlesByQuery } from '../../infra/repositories/BottleRepository';
import { AsKeyValue } from '../../infra/wrappers/ConsoleLogWrapper';
import { AskToReduceAsync } from '../../infra/wrappers/PromptsWrapper';
import { BottleArgs, ParseBottleArgs, ParseQuery } from '../BottleCmd';

export const AddBottleCmd: CommandModule<{}, BottleArgs> = {
	command: 'add <query>',

	builder: yargs => ParseBottleArgs(yargs),

	handler: HandleCommandAsync('AddBottleCmd', async ({ args }) => {
		const query = ParseQuery(args);
		const bottles = await FindBottlesByQuery(query);
		const bottle = await AskToReduceAsync(bottles, 'Which bottle did you mean?', p => p.Name);

		if (bottle == undefined) {
			throw new BottleNotFoundError(query.name);
		}

		console.log(AsKeyValue(bottle));
	})
};
