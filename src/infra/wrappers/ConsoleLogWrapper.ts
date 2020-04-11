import { bold, ChalkFunction, gray } from 'chalk';
import { max } from 'lodash';

export function format(formatter: string, ...args: unknown[]): string {
	return args.map(p => gray(p)).reduce((prev, cur) => prev.replace('%s', cur), formatter);
}

export function AsTable<RowType extends {}, ColType extends keyof RowType>(rows: RowType[]): string {
	let table = '';
	if (rows.length < 1) {
		return table;
	}

	const columns: ColType[] = Object.keys(rows[0]) as ColType[];
	const lengths: { [key: string]: number } = columns.reduce((prev, cur) => ({ ...prev, [cur]: (max([`${cur}`.length, ...rows.map(row => `${row[cur]}`.length)]) || 0) }), {});

	const join = (row?: RowType): string => columns.map(col => `${row ? row[col] : col}`.padEnd(lengths[`${col}`])).join('\t');

	table += bold(join()) + '\n';
	for (const row of rows) {
		table += join(row) + '\n';
	}

	return table;
}

export function AsKeyValue<RowType extends {}, ColType extends keyof RowType>(obj: RowType): string {
	const keys: ColType[] = Object.keys(obj) as ColType[];

	return AsTable(keys.map(p => ({
		key: p,
		value: obj[p]
	})))
}

export interface HighlightWordOpts {
	[word: string]: ChalkFunction;
}

export function Highlight(text: string, words: HighlightWordOpts): string {
	return Object.keys(words).reduce((prev, word) => {
		return prev.replace(new RegExp(word, 'gi'), p => words[word](p));
	}, text);
}
