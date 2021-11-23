# MAPREDUCER

## Description
------------------------
> A nodejs CLI tool, which accepts a file with numbers on each line and returns the sum of each line as well as the total sum of the numbers.

----------------------------------------------------------------------------------------------------

## Prerequisites
------------------------
	- NodeJS, you can install it from [here](https://nodejs.org/en/).

----------------------------------------------------------------------------------------------------

## Installation
------------------------
	> Open a terminal in project's root directory and run the command `npm link` as an administrator. If this command produce an error try `npm install`, before trying again.

----------------------------------------------------------------------------------------------------

## Usage
------------------------
	### For Linux:
		> Open a terminal in project's root directory.
		- To start the tool in server mode with the default port: `mapreducer --server <processes>`
		- To start the tool in server mode in specific port: `mapreducer --server <processes> -port <port>`

		> Then open another terminal in project's root directory.
		- To start the tool in client mode with the default port: `mapreducer --client <file>`
		- To start the tool in client mode in specific port: `mapreducer --client <file> -port <port>`

	### For Windows:
		> Open a terminal in project's root directory.
		- To start the tool in server mode with the default port: `node .\mapreducer --server <processes>`
		- To start the tool in server mode in specific port: `node .\mapreducer --server <processes> -port <port>`

		> Then open another terminal in project's root directory.
		- To start the tool in client mode with the default port: `node .\mapreducer --client <file>`
		- To start the tool in client mode in specific port: `node .\mapreducer --client <file> -port <port>`
----------------------------------------------------------------------------------------------------

## Arguments: 
------------------------
	-processes: The number of the child processes that the mapreduce tool will create.
	-port     : The port number the server will listen. [OPTIONAL]
	-file     : The text file with the numbers.
 