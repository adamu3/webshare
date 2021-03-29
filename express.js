var express = require('express');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);
/*var jQuery = require('./js/jquery');*/
var aesjs = require("./js/aes");
/*import qrcode from './js/jqueryqrcode.js';*/
var aesjs = require("./js/qrcodelib.js");

var WebCodeCamJS = require("./js/webcodecamjs");

var app = express();
app.use(express.static(__dirname + '/css'));
app.get('/', function (req, res) {	
var $ = jQuery = require('jquery')(window);	
	
	res.sendFile('simple2.html',{root: __dirname });
	$(document).ready(function(){
		console.log(23);
	})
    
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});