import { bold } from 'chalk';
import { max } from 'lodash';

export function PrintAsTable<RowType extends {}, ColType extends keyof RowType>(rows: RowType[]): void {
	if (rows.length < 1) {
		return;
	}

	const columns: ColType[] = Object.keys(rows[0]) as ColType[];
	const lengths: { [key: string]: number } = columns.reduce((prev, cur) => ({ ...prev, [cur]: (max([`${cur}`.length, ...rows.map(row => `${row[cur]}`.length)]) || 0) }), {});

	const join = (row?: RowType): string => columns.map(col => `${row ? row[col] : col}`.padEnd(lengths[`${col}`])).join('\t\t');

	console.log(bold(join()));
	for (const row of rows) {
		console.log(join(row));
	}
}

export function PrintAsKeyValue<RowType extends {}, ColType extends keyof RowType>(obj: RowType): void {
	const keys: ColType[] = Object.keys(obj) as ColType[];

	PrintAsTable(keys.map(p => ({
		key: p,
		value: obj[p]
	})))
}
