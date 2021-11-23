# MAPREDUCER

## Description
------------------------
> A nodejs CLI tool, which accepts a file with numbers on each line and returns the sum of each line as well as the total sum of the numbers.

### Functionality description
> Firstly we need to start the mapreduce program in server mode and specify a number of processes that it will start. Then in another terminal we start the mapreduce program in client mode and we specify a text file to read its lines. Then the client sends to the server an array, which has arrays with the numbers of each line. The server accepts the array and splits it into smaller chunks with the size of the count of the created processes. Then sends those chunks one by one at the child processes and they calculate the sum of each line and return it to the server. Then the server sends back the sums with a total sum of all the lines' numbers and the client print them in the console.

----------------------------------------------------------------------------------------------------

## Prerequisites
------------------------
- NodeJS, you can install it from [here](https://nodejs.org).

----------------------------------------------------------------------------------------------------

## Installation
------------------------
> Open a terminal in project's root directory and run the command `npm link` as an administrator.
> If this command produce an error try `npm install`, before trying again.

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
- processes: The number of the child processes that the mapreduce tool will create.
- port     : The port number the server will listen. [OPTIONAL]
- file     : The text file with the numbers.
 