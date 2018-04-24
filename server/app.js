const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use((req, res, next) => {
    //global replace all: /g
    var agent = req.headers['user-agent'].replace(/,/g, '');
    var time = new Date().toISOString();
    var method = req.method;
    var resource = req._parsedUrl['path'];
    var version = 'HTTP/' + req.httpVersion;
    var status = 200;

    //``ES6 string literal, allows string expression to be embedded automatically parsed
    var allData = `${agent},${time},${method},${resource},${version},${status}\n`;
    console.log(allData);

    ///log.csv didn't work --> replaced with actual path on computer
    fs.appendFile('/Users/abbysy/oca/startnow-node101-log-all-the-things/server/log.csv', allData, err => {
        if (err) throw (err);
    });
    next();
});

app.get('/', (req, res) => {
    res.status(200).send('ok');
});

app.get('/logs', (req, res) => {
    var csvFile = '/Users/abbysy/oca/startnow-node101-log-all-the-things/server/log.csv';
    var weGonStringDiz;
    var headz;
    var secondArray;
    var array = [];
    var emptyObject = [];
    fs.readFile(csvFile, (err, data) => {
        if (err) throw (err);
        weGonStringDiz = data.toString();
        array = weGonStringDiz.split("\n");
        headz = array[0].split(",");
        for (var i = 1; i < array.length - 1; i++) {
            secondArray = array[i].split(",");
            var obj = {};
            for (var j = 0; j < secondArray.length; j++) {
                obj[headz[j]] = secondArray[j];
            }
            emptyObject.push(obj);
        }
        res.send(emptyObject);
    });
});
module.exports = app;