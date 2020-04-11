import { CommandModule } from 'yargs';
import { BottleNotFoundError } from '../../domain/errors/BottleNotFoundError';
import { HandleCommandAsync } from '../../infra/handlers/CommandHandlers';
import { FindBottlesByQuery } from '../../infra/repositories/BottleRepository';
import { AsKeyValue } from '../../infra/wrappers/ConsoleLogWrapper';
import { CreateSpinnerAsync } from '../../infra/wrappers/OraChalkWrapper';
import { AskToReduceAsync } from '../../infra/wrappers/PromptsWrapper';
import { BottleArgs, ParseBottleArgs, ParseQuery } from '../BottleCmd';

interface Callback  {
	(writeLine: (formatter: string, ...args: unknown[]) => void): Promise<void>;
}

function StreamToFileAsync(callback: Callback): Promise<void> {
	return callback(() => {
		console.log('');
	});
}

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

		const steps = await CreateSpinnerAsync(bottle.GetStepsAsync(), 'getting steps');
		for (let i = 0; i < steps.length; i++) {
			const step = steps[i];

			await CreateSpinnerAsync(step.RunAsync(), '(%s/%s) Running %s', (i + 1), steps.length, step.Title);
		}
	})
};
