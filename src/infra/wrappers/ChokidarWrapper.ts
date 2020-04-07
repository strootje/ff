import { FSWatcher, watch as Chokidar, WatchOptions } from 'chokidar';
import { EventEmitter } from 'events';
import { readFileSync } from 'fs';
import { times } from 'lodash';
import { resolve } from 'path';
import { BottleJson } from '../../types/BottleJson';
import { CreateLogger } from './DebugChalkWrapper';
const logger = CreateLogger('infra:wrappers:ChokidarWrapper');

export interface BottleWatcherOpts {
	name: string;
	bottlesPerPage: number;
}

export interface BottleWatcherUpdateArgs {
	readonly filename: string;
	readonly json: Readonly<{}>;
}

interface ListOfBottles {
	[filename: string]: Readonly<BottleJson>;
}

export class BottleWatcher extends EventEmitter {
	private readonly bottles: ListOfBottles;
	private readonly watcher: FSWatcher;

	constructor(files: string,
		private readonly opts: BottleWatcherOpts & WatchOptions
	) {
		super();
		this.bottles = {};
		this.watcher = Chokidar(files, opts);

		this.watcher.on('error', error => this.emit('error', error));
		this.watcher.on('ready', () => {
			this.emit('ready');
			this.UpdateIndex();
		});

		this.watcher.on('add', this.AddBottle.bind(this));
		this.watcher.on('unlink', this.DeleteBottle.bind(this));
		this.watcher.on('change', filename => {
			this.DeleteBottle(filename);
			this.AddBottle(filename);
		});
	}

	public on(event: 'ready', listener: () => void): this;
	public on(event: 'error', listener: (error: Error) => void): this;
	public on(event: 'update', listener: (args: BottleWatcherUpdateArgs) => void): this;
	public on(event: 'delete', listener: (args: Omit<BottleWatcherUpdateArgs, 'json'>) => void): this;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public on(event: string, listener: (args?: any) => void): this {
		return super.on(event, listener);
	}

	public emit(event: 'ready'): boolean;
	public emit(event: 'error', args: Error): boolean;
	public emit(event: 'update', args: BottleWatcherUpdateArgs): boolean;
	public emit(event: 'delete', args: Omit<BottleWatcherUpdateArgs, 'json'>): boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public emit(event: string, args?: any): boolean {
		return super.emit(event, args);
	}

	public close(): Promise<void> {
		return this.watcher.close();
	}

	private AddBottle(filename: string): void {
		if (!this.bottles[filename]) {
			try {
				const path = resolve(this.opts.cwd || process.cwd(), filename);
				logger('add bottle %s', filename);
				this.bottles[filename] = JSON.parse(readFileSync(path, 'utf-8'));
				this.emit('update', { filename: `bottles/${filename}`, json: this.bottles[filename] });
				this.UpdateIndex();
			} catch (err) {
				// nothing ..
			}
		}
	}

	private DeleteBottle(filename: string): void {
		if (!!this.bottles[filename]) {
			logger('delete bottle %s', filename);
			delete this.bottles[filename];
			this.emit('delete', { filename: `bottles/${filename}` });
			this.UpdateIndex();
		}
	}

	private UpdateIndex(): void {
		logger('update %s', 'index.json');
		this.emit('update', {
			filename: 'index.json',
			json: {
				name: this.opts.name,
				pages: this.RecalculatePages()
			}
		});
	}

	private RecalculatePages(): string[] {
		const pages = times(Math.ceil(Object.keys(this.bottles).length / this.opts.bottlesPerPage), i => `bottles/pages/${i}.json`);
		for (let i = 0; i < pages.length; i++) {
			const page = pages[i];

			logger('update %s', page);
			this.emit('update', {
				filename: page,
				json: Object.keys(this.bottles).slice((i * this.opts.bottlesPerPage), ((i * this.opts.bottlesPerPage) + this.opts.bottlesPerPage))
					.map(p => ({ filename: p, bottle: this.bottles[p] }))
					.map(({ filename, bottle }) => ({
						name: bottle.name,
						version: bottle.version,
						tags: bottle.tags,
						link: `bottles/${filename}`
					}))
			})
		}

		return pages;
	}
}
