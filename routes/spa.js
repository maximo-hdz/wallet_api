var soap = require('soap');
var soapurl = process.env.SOAP_URL;
var config = require('../config.js');
var logger = config.logger;
var User = require('../model/user');
var Transaction = require('../model/transacction');
var Receipt = require('../model/receipt');
var Loan = require('../model/loan');
var async = require('async');


exports.getUsers = function(req, res) {
    var totalUsers;
    var countPublic;
    var countInternal;

    async.waterfall([

        function(callback){
        User.find( {}, 'OS company doxs email facebook group name phoneID twitter profileCompleted', { sort : { lastSession : -1 } }, function(err, users) {
            if (err)
                callback('ERROR', { statusCode : 1, additionalInfo : err } );
            else{
                totalUsers = users;
                callback(null);
            }
        });

    },
    function(callback){
          var query = User.find({group: { $nin : ['PUBLIC'] }});
          query.count();
          query.exec(function (err, usersInternal) {
            if (err)
                callback('ERROR',{ statusCode : 1, additionalInfo : err } );
            else{
                countInternal = usersInternal;
                callback(null);
            }
          });
    },
    function(callback){
        var userPublic = User.find({group:'PUBLIC'});
        userPublic.count();
        userPublic.exec(function (err, userPublic) {
            if (err)
                callback('ERROR' ,{ statusCode : 1, additionalInfo : err } );
            else{
                countPublic = userPublic;
                callback(null);
            }
        });
    }
    ], function (err, result) {
      if(err){
        console.log('Error  --->' + JSON.stringify(err));
      }else{
        res.json({statusCode:0, additionalInfo : { users: totalUsers , public : countPublic , internal :countInternal }});
      }
    });

};

exports.getTransactions = function(req, res) {
    var phoneID = req.param('phoneID');
    var type = req.param('type').toUpperCase();
    var conditions = { 'phoneID' : phoneID, 'type' : type };
    console.log( 'Getting ' + type + ' Transactions for user: ' + phoneID );
    Transaction.find( conditions, 'title type date amount operation description', { sort : { date : -1 } }, function(err, trans) {
       if (err)
           res.json( { statusCode : 1, additionalInfo : 'There was an error' } );
        else
            res.json( { statusCode : 0, additionalInfo : trans } );
    });
};

exports.getReceipts = function(req, res) {
    var phoneID = req.param('phoneID');
    console.log( 'Getting Receipts for user: ' + phoneID );
    Receipt.find( { 'emitter' : phoneID }, 'amount date type status receiver', { sort : { date : -1 } }, function(err, receipts) {
        if (err)
            res.json( { statusCode : 1, additionalInfo : 'There was an error' } );
        else
            res.json( { statusCode : 0, additionalInfo : receipts } );
    });
};

exports.getLoans =  function(req, res) {
    var phoneID = req.param('phoneID');
    console.log( 'Getting Loans for user: ' + phoneID );
    Loan.find( { 'phoneID' : phoneID }, 'amount date status merchantID', { sort : { date : -1 } }, function(err, loans) {
        if (err)
            res.json( { statusCode : 1, additionalInfo : 'There was an error' } );
        else
            res.json( { statusCode : 0, additionalInfo : loans } );
    });
};
