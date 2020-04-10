import * as PromptsAsync from 'prompts';

export interface AskToReduceTitleSelector<T> {
	(item: T): string;
}

export async function AskToReduceAsync<T>(items: T[], message: string, selector: AskToReduceTitleSelector<T>): Promise<T | undefined> {
	if (items.length === 1) {
		return items[0];
	}

	const anwser = await PromptsAsync({
		type: 'autocomplete',
		name: 'item',
		message: message,
		choices: items.map(p => ({ title: selector(p), value: p }))
	});

	return anwser.item;
}
