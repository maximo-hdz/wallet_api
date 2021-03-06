var mongoose = require('mongoose');
var Product = require('../model/product');
var Productquery = require('../model/queries/product-query');
var Prizequery = require('../model/queries/prize-query');
var Receiptquery = require('../model/queries/receipt-query');
var OrderTemporalquery = require('../model/queries/orderTemporal-query');
var soap = require('soap');
var soapurl = process.env.SOAP_URL;

exports.products =  function(req, res){
  console.log('POST method products');
    Productquery.getProductSchedule(req.body.merchantID, function(err, result) {
        res.json(result);
    });
};

exports.inventory = function(req, res) {
    console.log( 'POST method inventary' );
    Productquery.getInventory(req.body.merchantID, function(err, result) {
       res.json(result); 
    });
};

exports.updateInventory = function(req, res) {
    console.log( 'POST method updateInventory' );
    Productquery.updateInventory(req.body, function(err, result) {
        res.json(result);
    });
};

exports.getPrizes = function(req, res){
    console.log('GET method prizes');
    Prizequery.getPrizes(parseInt(req.query.top), function(err, result){
        res.json(result);
    });
}

exports.changeReceiptStatus = function(req, res){
    console.log('PUT method changeReceiptStatus');
    Receiptquery.updateReceiptStatus(req.body, function(err, result){
        res.json(result);
    });
}

exports.products2 =  function(req, res){
  console.log('POST method products');
    Productquery.getProductsDiscountSchededule(req.body.merchantID, function(err, result) {
        res.json(result);
    });
};


exports.getOrderTemporals = function (req, res) {
    console.log('GET method orderTemporals');
    OrderTemporalquery.getAllOrderTemporals(function(err,result){
        res.json(result);
    });
};