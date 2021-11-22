"use strict";

process.on('message', function(data) {
    const line_number = Object.keys(data)[0];
    const line_values = data[Object.keys(data)[0]];
    const sum         = line_values.reduce((a, b) => a + b, 0);
    const new_object  = {};
    
    new_object[line_number] = sum;

    process.send(new_object);
});