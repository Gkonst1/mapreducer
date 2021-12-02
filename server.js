#!/usr/bin/env node

const spawn  = require('child_process');
var events   = require('events');
const http   = require('http');
const crypto = require('crypto');

const myArgs = process.argv.slice(2);

const emitter        = new events.EventEmitter();
let num_of_processes = null;
const algorithm  	 = 'aes-256-ctr';
let array_of_lines   = [];
let splitted_array   = [];
let proc_array       = [];
let sum_array        = [];


/**************** Function Declarations ****************/

/**
 * Sends a small chunk of data at the active processes to
 * calculate the sum
 */
const sendData = () => {
	let count = 0;

	for (i=0; i < splitted_array.length; i++) {
		for (j=0; j < proc_array.length; j++) {
			if (splitted_array[i][j]){
				count++;
				let object_to_send    = {};
				object_to_send[count] = splitted_array[i][j];
				proc_array[j].send(object_to_send);
			};
		};
	};
};


/**
 * Creates a child process by forking the child.js
 */
const createProc = () => {
	const child = spawn.fork('./child.js');
	proc_array.push(child);

	child.on('message', function(m) {
	  	sum_array.push(m);

	  	if (sum_array.length == array_of_lines.length) {
	  		emitter.emit('sendDataBack');
	  	};
  	});
};


/**
 * Splits an array into smaller chunks with the size of the
 * active processes
 * 
 * @param  {array} The array with all the file lines 
 * 				   from the client
 */
const split_array = (array) => {
	let temp_array = [];
	let count      = 0;

	while (count < array.length) {
		for (i=0; i < num_of_processes; i++) {
			if (array[count]) {
				temp_array.push(array[count]);
				count++;
			}
		}
		splitted_array.push(temp_array);
		temp_array  = [];
	};
};


/**
 * Creates all the necessary child processes
 */
const spawnProcesses = () => {
	for (i=0; i < num_of_processes; i++) {
		createProc();
	};
};


/**
 * Kills the created processes just before the program exits
 */
const killProcesses = () => {
	emitter.removeAllListeners('sendDataBack')

	for (i=0; i < proc_array.length; i++) {
		proc_array[i].removeAllListeners('message');
  		proc_array[i].kill('SIGINT');
	};
}


/**
 * Valdiates the user input for the process number and
 * stops the execution of the program if the user didn't
 * add the number of processes
 */
const validateProcessesInput = () => {
	if (myArgs[0] && Number.isInteger(parseInt(myArgs[0])) && parseInt(myArgs[0]) > 0) {
		num_of_processes = parseInt(myArgs[0]);
	} else {
		console.log('Please provide the number of the child processes');
		console.log('WARNING: The number for the child processes must be a positive integer.');
		console.log('Syntax: ./server.js <number of processes>');
		process.exit();
	};
};


/**
 * Check if the user provided specific port for the server
 * to listen and validates the input
 */
const validatePortInput = () => {
	if (myArgs.includes('\-port')) {
		port_index = myArgs.indexOf('-port') + 1;

		if (myArgs[port_index] &&
			Number.isInteger(parseInt(myArgs[port_index])) &&
			parseInt(myArgs[port_index]) > 0 &&
			parseInt(myArgs[port_index]) < 65535)
		{
			process.env.PORT = myArgs[myArgs.indexOf('-port') + 1];
		} else {
			console.log('Please provide a valid port number (integer between 1-65535).');
			process.exit();
		};
	};
};


/**************** Start of Program ****************/

validateProcessesInput();
validatePortInput();
spawnProcesses();

const PORT = process.env.PORT || 5000;

// Start the web server
var server = http.createServer(async function (req, res) {
	secret_key = JSON.parse(req.headers['public-key-pins']).key;
	iv         = JSON.parse(req.headers['public-key-pins']).iv;

	req.on('data', chunk => {
		encrypted_data = JSON.parse(chunk).toString();

		const decipher  = crypto.createDecipheriv(algorithm, secret_key, Buffer.from(iv, 'hex'));
		const decrpyted = Buffer.concat([decipher.update(Buffer.from(encrypted_data, 'hex')), decipher.final()]);
		
		data           = JSON.parse(decrpyted.toString());
		array_of_lines = data['data'];
		splitted_array = [];
		sum_array      = [];

		emitter.on('sendDataBack', function() {
			res.end(JSON.stringify(sum_array));
		});

	    split_array(array_of_lines);
	    sendData();
	});

	req.on('error', (e) => {
		console.log(e.message);
	});
});

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

server.once('error', function(err) {
  if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
    console.log("Port is currently in use");
  };
});

process.on('exit', killProcesses.bind());
