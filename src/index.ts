import * as Yargs from 'yargs';
import { RemoteCmd } from './cmds/RemoteCmd';
import { RemotesCmd } from './cmds/RemotesCmd';
import { ServerCmd } from './cmds/ServerCmd';

export const argv = Yargs
	.scriptName('ff')
	.command(ServerCmd)
	.command(RemotesCmd)
	.command(RemoteCmd)
	.help().argv;
