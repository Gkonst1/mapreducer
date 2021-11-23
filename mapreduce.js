#!/usr/bin/env node

const spawn = require('child_process');

const myArgs = process.argv.slice(2);

if (!myArgs[0] || (myArgs[0] !== '--server' && myArgs[0] !== '--client')) {
	console.log('Please specify a mode for the program to run.');
	console.log('Syntax: mapreduce <mode> <parameters>');
	console.log('Server example: mapreduce --server 3');
	console.log('Client example mapreduce --client file.txt');
	process.exit();
} else {
	if (myArgs[0] === '--server') {
		var child = spawn.fork('./server.js', [myArgs[1], myArgs[2], myArgs[3]]);
	} else if (myArgs[0] === '--client') {
		var child = spawn.fork('./client.js', [myArgs[1], myArgs[2],myArgs[3]]);
	} else {
		process.exit();
	};
};