var async = require('async');
var request = require('request'); // include request module
var transacction = require('../transacction');
var User = require('../user');
var config = require('../../config.js');
var moment = require('moment-timezone');

exports.findUserTransfers = function(phoneID, callback) {
    var date = new Date(moment().tz(process.env.TZ));
    var current_hour = (date.getHours() < 10) ? '0'+date.getHours() : date.getHours();
    var current_year = date.getFullYear();
    var current_month = (date.getMonth() < 10) ? '0'+date.getMonth() : date.getMonth(); 
    var current_day = (date.getDay() < 10) ? '0'+date.getDay() : date.getDay(); 

    var date = moment().tz(process.env.TZ).format("YYYY-MM-DD");
    var time = moment().tz(process.env.TZ).format("HH");
    var  initDate = date + ' ' + time +':00:00';
    var  endDate =  date + ' ' + time +':59:00';
    console.log('Init date '+ initDate);
    console.log('End date '+ endDate );

    var conditions = { "phoneID" : phoneID, type:'MONEY', operation:'TRANSFER',  date:{
              $gte: initDate,
              $lt: endDate }};
    var transactions = transacction.find(conditions, 'title description amount date operation type phoneID');
    transactions.limit(5);
    transactions.exec(function (err1, transactions) {
        if(transactions.length === 5)
            callback(config.messages.transferRejectedOneMsg,null);
        else
            callback(null,transactions);

    });
};

exports.getTransacctions = function(phoneIDToSearch, callback) {
    console.log( 'Get Transacctions' );
    transacction.find({phoneID:phoneIDToSearch, type:'MONEY'}, 'title description amount date',{sort: {date: -1}}, function(err, transacction)  {
        var response;
        if (err) {
            response = { statusCode: 1, additionalInfo: err };
            console.log(err.message);
            callback("ERROR: " + err.message, response);
        } else if (transacction.length === 0) {
            console.log('Empty');
            response = { statusCode: 0, additionalInfo: 'Empty' };
            callback(null, response);
        } else {
            console.log('Return Collection');
            response = { statusCode: 0, additionalInfo: transacction };
            callback(null, transacction);
        }
    });
};

exports.getTransacctionsDox = function(phoneIDToSearch, callback) {
    console.log( 'Get Transacctions DOX' );
    transacction.find({phoneID:phoneIDToSearch, type:'DOX'}, 'title description amount date',{sort: {date: -1}}, function(err, transacction)  {
        var response;
        if (err) {
            response = { statusCode: 1, additionalInfo: err };
            console.log(err.message);
            callback("ERROR: " + err.message, response);
        } else if (transacction.length === 0) {
            response = { statusCode: 0, additionalInfo: 'Empty' };
            callback(null, response);
        } else {
            callback(null, transacction);
        }
    });
};

exports.createTranssaction = function(data, callback) {
    console.log('Save transacction');
    var newTransacction = new transacction(data);
    var result = newTransacction.save(function(err) {
        if (err) return 1;
        return 0;
    });
    if (result === 1)
        callback('ERROR', 'The transacction could not be created');
    else
        callback(null, 'The Transacction was created successfully');
};

exports.getTransacctionsSocialFeed = function(callback) {
    console.log( 'Get Transacctions' );
    //compras
    //regalos 
    //transferencias
    async.waterfall([

        function(callback){
            var buyTransactionsFinal = [];
            var conditionsBuys = { 'operation':config.messages.type.BUY };
            var buys = transacction.find(conditionsBuys, 'title description amount date operation type phoneID');
            buys.sort({date: -1});
            buys.limit(10);
            buys.exec(function (err1, buyTransactions) {
            if(buyTransactions.length === 0)
                callback(null,null);

            buyTransactions.forEach(function(v){
                   User.findOne({'phoneID': v.phoneID }, 'name', function (err, user) {
                        var tmp = v.toObject();
                        tmp.avatar = config.S3.url + v.phoneID+'.png';
                        tmp.name = user.name;
                        buyTransactionsFinal.push(tmp);
                        if(buyTransactionsFinal.length === buyTransactions.length){
                            console.log('DONE transactions');
                            callback(null,buyTransactionsFinal);
                        }
                  });
            });
        });
        },

        function(buyTransactions, callback){
            var transferTransactionsFinal = [];
            var conditionsTransfers = { 'operation':config.messages.type.TRANSFER }
            var transfers = transacction.find(conditionsTransfers, 'title description amount date operation type phoneID');
            transfers.sort({date: -1});
            transfers.limit(10);
            transfers.exec(function (err1, transferTransactions) {
            if(transferTransactions.length === 0)
                callback(null,buyTransactions,null);

                transferTransactions.forEach(function(v){
                   User.findOne({'phoneID': v.phoneID }, 'name', function (err, user) {
                        var tmp = v.toObject();
                        tmp.avatar = config.S3.url + v.phoneID+'.png';
                        tmp.name = user.name;
                        transferTransactionsFinal.push(tmp);
                        if(transferTransactionsFinal.length === transferTransactions.length){
                            console.log('DONE buys');
                            callback(null,buyTransactions,transferTransactionsFinal);
                        }
                });
            });
        });

        },
        
        function(buyTransactions, transferTransactions, callback){
            var giftsTransactionsFinal = [];
            var conditionsGifts = { 'operation':config.messages.type.GIFT };
            var gifts = transacction.find(conditionsGifts, 'title description amount date operation type phoneID');
            gifts.sort({date: -1});
            gifts.limit(10);
            gifts.exec(function (err1, giftsTransactions) {
            if(giftsTransactions.length === 0)
                callback(null,buyTransactions,transferTransactions,null);

                  giftsTransactions.forEach(function(v){
                   User.findOne({'phoneID': v.phoneID }, 'name', function (err, user) {
                        if(user){
                            console.log('SHOWUSER');
                            console.log(user);
                            var tmp = v.toObject();
                            tmp.avatar = config.S3.url + v.phoneID+'.png';
                            tmp.name = user.name;
                        }
                        giftsTransactionsFinal.push(tmp);
                        if(giftsTransactionsFinal.length === giftsTransactions.length){
                            console.log('DONE gifts');
                            callback(null,buyTransactions, transferTransactions,giftsTransactionsFinal);
                        }
                });
            });
        });

        },

        function(buyTransactions, transferTransactions,giftsTransactions, callback){
            var resulTransactions = {};
            if(buyTransactions)
                resulTransactions = buyTransactions;
            if(transferTransactions)
                resulTransactions = resulTransactions.concat(transferTransactions);
            if(giftsTransactions)
                resulTransactions = resulTransactions.concat(giftsTransactions);
            if(resulTransactions && resulTransactions.length > 0 ){
            resulTransactions.sort(compare);
        response = { statusCode: 0, additionalInfo:resulTransactions };
        }else{
        response = { statusCode: 0, additionalInfo:[] };
        }
            callback(null, response);
        }

        ], function (err, result){
            callback(null,result);
        });
};


function compare(a,b) {
    var keyA = new Date(a.date),
    keyB = new Date(b.date);
    // Compare the 2 dates
    if(keyA > keyB) return -1;
    if(keyA < keyB) return 1;
    return 0;
};
