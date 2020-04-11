import { humanizer } from 'humanize-duration';
import * as OraSync from 'ora';
import { Ora } from 'ora';
import { format } from './ConsoleLogWrapper';
import { DebugChalkLogger } from './DebugChalkWrapper';

const parse = humanizer({
	round: true,
	largest: 2,
	spacer: '',
	language: 'shortEn',
	languages: {
		shortEn: {
			y: (): string => 'y',
			mo: (): string => 'mo',
			w: (): string => 'w',
			d: (): string => 'd',
			h: (): string => 'h',
			m: (): string => 'm',
			s: (): string => 's',
			ms: (): string => 'ms',
		}
	}
});

export async function CreateSpinnerAsync<T>(promise: PromiseLike<T>, formatter: string, ...args: unknown[]): Promise<T> {
	const spinner = OraSync({
		text: format(formatter, ...args)
	});

	const prevNow = Date.now();
	const timer = setTimeout(() => {
		const diff = Math.floor(Date.now() - prevNow);
		spinner.text = format(`${formatter} +%s`, ...[...args, parse(diff)])
		timer.refresh();
	}, 999);

	try {
		spinner.start();
		const result = await promise;
		spinner.succeed();
		return result;
	} catch (err) {
		spinner.fail(err.message);
		throw err;
	} finally {
		clearTimeout(timer);
	}
}

export interface OraChalkEventSpinnerCallback {
	(writeLine: DebugChalkLogger): Promise<void>;
}

export async function CreateEventSpinnerAsync(callbackAsync: OraChalkEventSpinnerCallback): Promise<void> {
	let spinner: Ora = OraSync({});

	const writeLine: DebugChalkLogger = (formatter: string, ...args: unknown[]): void => {
		spinner.succeed(format(formatter, ...args));
		spinner = OraSync({ text: 'waiting for next event ..' }).start();
	};

	try {
		await callbackAsync(writeLine);
		spinner.stop();
	} catch (err) {
		spinner.fail(err.message);
	}
}
