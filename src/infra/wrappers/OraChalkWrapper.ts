import { gray } from 'chalk';
import * as OraSync from 'ora';
import { Ora } from 'ora';
import { DebugChalkLogger } from './DebugChalkWrapper';

export interface OraChalkSpinnerCallback {
	(update: DebugChalkLogger): Promise<void>;
}

export async function CreateSpinnerAsync(callbackAsync: OraChalkSpinnerCallback): Promise<void> {
	let spinner: Ora = OraSync({});

	const update: DebugChalkLogger = (formatter: string, ...args: unknown[]): void => {
		spinner.succeed(args.map(p => gray(p)).reduce((prev, cur) => prev.replace('%s', cur), formatter));
		spinner = OraSync({ text: 'waiting for next event ..' }).start();
	};

	try {
		await callbackAsync(update);
		spinner.stop();
	} catch (err) {
		spinner.fail(err.message);
	}
}
