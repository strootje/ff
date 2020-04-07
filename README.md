# ff

## Usage
```
ff server <command>
	[--name <name> (PC-NAME)]
	[--remote <path>]
	[--include <include> (**/*.json)]
	[--exclude <exclude> ()]
ff server build [path <path> (./)]
	[--out <path> (./dist)]
ff server serve [path <path> (./)]
	[--host <host> (0.0.0.0)]
	[--port <port> (1415)]

ff remotes <command>
ff remote add <name> <path>
ff remote del <name>
ff remote info <name>

ff bottle <command>
	[--remote <remote-name>]
	[--version <pkg-version>]
ff bottle add <[remote-name/]pkg[@pkg-version]>
ff bottle del <[remote-name/]pkg[@pkg-version]>
ff bottle find <[remote-name/]pkg[@pkg-version]>
ff bottle info <[remote-name/]pkg[@pkg-version]>




-- ff bottle up [--remote <remote-name>] [--version <pkg-version>] [[remote-name/]pkg[@pkg-version]]
```

## Config
client (.ffrc):
```
{
	remotes: [
		{ "name": "https://bottles.surge.sh" }
	]
}
```

server (.server.ffrc):
```
{
	"remote": "https://bottles.surge.sh"
}
```

## Support

### Bottles
* wine
* pacman
* node/npm
* flatpak
* make
* container

### Stores:
* bottles (my own)
* node - npm
* flatpak - flathub
* pacman - system (pacman, yay, apt-get, yum, etc..)
* docker - dockerhub
