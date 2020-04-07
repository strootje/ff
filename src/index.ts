import * as Yargs from 'yargs';
import { ServerCmd } from './cmds/ServerCmd';

export const argv = Yargs
	.scriptName('ff')
	.command(ServerCmd)
	.help().argv;
