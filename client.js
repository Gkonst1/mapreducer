#!/usr/bin/env node

const fs     = require('fs');
const http   = require('http');
const crypto = require('crypto');

const myArgs     = process.argv.slice(2);
const algorithm  = 'aes-256-ctr';
const secret_key = 'Super strong key to encrypt data';
const iv         = crypto.randomBytes(16);
let lines_array  = [];
let sums_array   = [];


/**
 * Creates the http POST request for the server
 * 
 * @param  {JSON} The JSON object with the line numbers
 *  			  array 
 */
const makeRequest = (data) => {
	const options = {
			hostname: 'localhost',
			port    : process.env.PORT || 5000,
			path    : '/',
			method  : 'POST',
			headers : {
			    'Content-Type'    : 'application/json',
			    'Content-Length'  : data.length,
			    'Public-Key-Pins' : JSON.stringify({
			    	key: secret_key,
			    	iv : iv
			    })
			}
		}

		const req = http.request(options, res => {
		  	res.on('data', d => {
		    	sums_array = JSON.parse(d.toString())
		  	})

		  	res.on('end', () => {

		    	// Sorts the array by the object key
				sums_array.sort(function(a,b){
				    return (Object.keys(a)[0] - Object.keys(b)[0]);
				});

				total_sum = 0;
				for (i=0; i < sums_array.length; i++) {
					line_sum = sums_array[i][i+1]
					console.log(`Array ${i+1}: `, line_sum)
					total_sum += line_sum;
				}	

				console.log('Total: ', total_sum)

				process.exit();
		  	})
		})

		req.on('error', error => {
		  	if (error.code == 'ECONNREFUSED') {
		  		console.log('Please use the same port number for client and server.')
		  	} else {
		  		console.log(error.message)
		  	}
		  	process.exit()
		})

		req.write(data)
		req.end()
}


/**
 * Checks if the user provided a port and validates it
 */
const checkForPort = () => {
	if (myArgs.includes('\-port')) {
		port_index = myArgs.indexOf('-port') + 1;

		if (myArgs[port_index] &&
			Number.isInteger(parseInt(myArgs[port_index])) &&
			parseInt(myArgs[port_index]) > 0 &&
			parseInt(myArgs[port_index]) < 65535)
		{
			process.env.PORT = myArgs[myArgs.indexOf('-port') + 1];
		} else {
			console.log('Please provide a valid port number (integer between 1-65535).')
			process.exit();
		}
	};
}

if (!myArgs[0]) {
	console.log("Please specify the text file.");
	console.log("Syntax: ./client.js <filename>.txt");
	process.exit();
} else {
	filename = myArgs[0];

	function createLinesArray() {
		return new Promise(resolve => {
		    fs.access(filename, fs.F_OK, (err) => {
			  	if (err) {
			    	console.log("Please specify a valid text file.");
					console.log("Syntax: ./client.js <filename>.txt");
			    	return
				}

				var lineReader = require('readline').createInterface({
					input: fs.createReadStream(filename)
				});

				lineReader.on('line', function (line) {
					lines_array.push(line.split(/[\s,]/g));

					for (i=0; i<lines_array.length; i++) {
						lines_array[i] = lines_array[i].map(item => parseInt(item)).filter(item => !Number.isNaN(item))
						resolve();
					}
				});
			})
		});
	}	

	async function sendData() {
		const result = await createLinesArray();
		const data   = JSON.stringify({
	  		data: lines_array
		})

		const cipher    = crypto.createCipheriv(algorithm, secret_key, iv);
		const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
		final_data      = encrypted.toString('hex')

		checkForPort();
		makeRequest(JSON.stringify(final_data));
	}
	sendData();
}