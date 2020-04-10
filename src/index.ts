import * as Yargs from 'yargs';
import { BottleCmd } from './cmds/BottleCmd';
import { RemoteCmd } from './cmds/RemoteCmd';
import { RemotesCmd } from './cmds/RemotesCmd';
import { ServerCmd } from './cmds/ServerCmd';

export const argv = Yargs
	.scriptName('ff')
	.command(ServerCmd)
	.command(RemotesCmd)
	.command(RemoteCmd)
	.command(BottleCmd)
	.help().argv;
