var async = require('async');
var moment = require('moment-timezone');
var User = require('../user');
var config = require('../../config.js');
var balance = require('../../routes/flows/balance-flow');
var transfer = require('../../routes/flows/transfer-flow');
var profileFlow = require('../../routes/flows/profile-flow');
var doxsService = require('../../services/doxs-service');
var mailService = require('../../services/sendGrid-service');
var transacctionQuery = require('../../model/queries/transacction-query');
var merchantQuery = require('../../model/queries/merchant-query');
var sessionQuery = require('./session-query');
var enviromentQuery = require('./enviroment-query');
var transacction = require('../transacction');
var soap = require('soap');
var soapurl = process.env.SOAP_URL;
var Userquery = require('../../model/queries/user-query');

exports.findUserGifts = function(phoneID, callback) {
    var date = new Date(moment().tz(process.env.TZ));
    var current_hour = (date.getHours() < 10) ? '0'+date.getHours() : date.getHours();
    var current_year = date.getFullYear();
    var current_month = (date.getMonth() < 10) ? '0'+date.getMonth() : date.getMonth();
    var current_day = (date.getDay() < 10) ? '0'+date.getDay() : date.getDay();

    var date = moment().tz(process.env.TZ).format("YYYY-MM-DD");
    var time = moment()
    .tz(process.env.TZ).format("HH");
    var  initDate = date + ' ' + time +':00:00';
    var  endDate =  date + ' ' + time +':59:00';
    console.log('Init date '+ initDate);
    console.log('End date '+ endDate );

    var conditions = { "phoneID" : phoneID, type:'MONEY', operation:'GIFT',  date:{
              $gte: initDate,
              $lt: endDate }};
    var transactions = transacction.find(conditions, 'title description amount date operation type phoneID');
    transactions.limit(5);
    transactions.exec(function (err1, transactions) {
        if(transactions.length === 5)
            callback(config.messages.giftRejectedOneMsg,null);
        else
            callback(null,transactions);

    });
};

exports.findUserBuys = function(phoneID, callback) {
    var date = new Date(moment().tz(process.env.TZ));
    var current_hour = (date.getHours() < 10) ? '0'+date.getHours() : date.getHours();
    var current_year = date.getFullYear();
    var current_month = (date.getMonth() < 10) ? '0'+date.getMonth() : date.getMonth();
    var current_day = (date.getDay() < 10) ? '0'+date.getDay() : date.getDay();

    var date = moment().tz(process.env.TZ).format("YYYY-MM-DD");
    var time = moment()
    .tz(process.env.TZ).format("HH");
    var  initDate = date + ' ' + time +':00:00';
    var  endDate =  date + ' ' + time +':59:00';
    console.log('Init date '+ initDate);
    console.log('End date '+ endDate );

    var conditions = { "phoneID" : phoneID, type:'MONEY', operation:'BUY',  date:{
              $gte: initDate,
              $lt: endDate }};
    var transactions = transacction.find(conditions, 'title description amount date operation type phoneID');
    transactions.limit(5);
    transactions.exec(function (err1, transactions) {
        if(transactions.length === 5)
            callback(config.messages.buyRejectedOneMsg,null);
        else
            callback(null,transactions);

    });
};
exports.validateSMS = function(phoneID,callback){
  console.log('Search user in mongoDB ' + phoneID);
  User.findOne({ 'phoneID': phoneID }, 'name sms', function (err, user) {
    if (err) return handleError(err);
      if(user && !user.sms)
        callback(null, 0);
      else
        callback(null,user.sms);
  });
};

exports.validateUser = function(phoneID,callback){
	console.log('Search user in mongoDB');
	User.findOne({ 'phoneID': phoneID }, 'name 	email pin	phoneID appID canPurchase', function (err, person) {
		if (err) return handleError(err); 
		else if(!person)
			callback("ERROR", { statusCode: 1 ,  additionalInfo: 'User is not yet registered' });
		else{
			var  response =   { statusCode: 0 ,  additionalInfo: person };
			callback(null, response);
		}	
	});
};


exports.validateAnswer = function(phoneID,answer,callback){
  console.log('Verify answer to secret question');
  User.findOne({ 'phoneID': phoneID , 'answer': answer}, 'name  email pin phoneID appID', function (err, person) {
      if (err) return handleError(err);
    else if(!person)
      callback("ERROR", { statusCode: 1 ,  additionalInfo: 'User not exist or answer is not correct' });
    else{
      var  response =   { statusCode: 0 ,  additionalInfo: 'response correct' };
      callback(null, response);
    }
  });
}

exports.createUser = function(user,callback){
  console.log("Saving User in MongoDB");
  var propSessionID = "sessionid";
  delete user[propSessionID];
  var propInitiator = "initiator";
  delete user[propInitiator];
  user.email = user.email_address;
  console.log(user);
  var userToPersist = new User(user);
  console.log('User to persist user' + userToPersist);

  if(user.email_address)
    mailService.sendRegisterMessage(user, function(err, result) {
      if (err)
        callback('ERROR', { statusCode : 1, additionalInfo : result } );
      else
        userToPersist.save(function (err) {
          if (err) callback("ERROR", { statusCode: 1,  additionalInfo: 'Error to register user' });
          callback(null, { statusCode: 0 ,  additionalInfo: 'User registered correctly' });
        });
    });
};

exports.singleUpdateUser = function(payload,callback){
  var conditions = { 'phoneID': payload.phoneID }
  User.update(conditions, payload, null, function(err, result) {
    if(err) {
      return new Error(err);
    } else {
      callback(null);
    }
  });
}

exports.updateUserPurchaseFlag = function(payload,callback){
    console.log('Upatdate user flag' + JSON.stringify(payload));
    var conditions = { 'phoneID': payload.phoneID }
    User.update(conditions, payload, null, function(err, result) {
    if(err){
      console.log(err);
      callback('ERROR',err);
    }else
      callback(null,result);
    });
}

exports.updateUser = function(payload,callback){

  async.waterfall([

    function(callback){
      if(payload.email_address)
        payload.email = payload.email_address;
      var conditions = { 'phoneID': payload.phoneID }
      User.update(conditions, payload, null, function(err, result) {
        if(err){
          console.log(err);
          callback('ERROR',err);
        }else
          callback(null);
        });
    },

    function(callback){
      if(payload.profileCompleted === 1 || payload.profileCompleted === "1" ){
        var transacction = {};
        transacction.title = 'Update Profile';
        transacction.date = moment().tz(process.env.TZ).format().replace(/T/, ' ').replace(/\..+/, '').substring(0,19);;
        transacction.type = 'DOX',
        transacction.amount = config.doxs.profile;
        transacction.description = 'You had earned some doxs points for completing your profile!'
        transacction.operation = 'Update profile';
        transacction.phoneID = payload.phoneID;
        transacctionQuery.createTranssaction(transacction, function(err, result) {

          var payloadoxs = {phoneID: payload.phoneID, action: 'profile', type: 3}
          doxsService.saveDoxs(payloadoxs, function(err, result){
            if(err) {
              console.log(err);
              callback('ERROR',err);
            } else {
              callback(null);
            }
          });
        });
      }else
      callback(null);
    },

    function(callback){
      if(payload.profileCompleted === 1 || payload.profileCompleted === "1" ){
        var updateDoxs = {phoneID: payload.phoneID, operation: 'profile', sessionid: payload.sessionid};
        putDoxs(updateDoxs, function(err,result){
            if(err) {
              console.log(err);
              callback('ERROR',err);
            } else 
              callback(null);
        });
      }else
      callback(null);
    },

    function(callback){
      console.log(payload.sessionid);
        balance.balanceFlow(payload.sessionid, function(err, result) {
          if(err){
            var response = { statusCode: 1, additionalInfo: result };
              if(err) {
                console.log(err);
                callback('ERROR',err);
              } else 
                callback('ERROR', response);
          }
          else{
            console.log(result);
            if(payload.profileCompleted === 1 || payload.profileCompleted === "1" )
              result.additionalInfo.doxAdded = config.doxs.profile;
            callback(null,result);
          }
        });
    },
    ], function (err, result) {
      console.log('Return Update User');
      if(err){
        callback(err,result);
      }else{
        callback(null,result);
      }
    });
};

exports.findAppID = function(phoneID,callback){
  console.log('Search user in mongoDB');
  console.log(phoneID);
  User.findOne({ 'phoneID': phoneID }, 'appID OS name environment ', function (err, person) {
    if (err) return handleError(err);
    else if(!person)
      callback("ERROR", { statusCode: 0 ,  additionalInfo: 'User not  Found' });
    else
      callback(null, person);
  });
};

exports.findUserByPhoneID = function(phoneID,callback){
  console.log('Search user in mongoDB');
  console.log(phoneID);
  User.findOne({ 'phoneID': phoneID }, 'name email', function (err, person) {
    if (err) return handleError(err);
    else if(!person)
      callback("ERROR", { statusCode: 0 ,  additionalInfo: 'User not  Found' });
    else
      callback(null, person);
  });
};

exports.getIdByPhoneID = function(phoneID,callback){
  console.log('Search user in mongoDB');
  console.log(phoneID);
  User.findOne({ 'phoneID': phoneID }, '_id', function (err, person) {
    if (err) return handleError(err);
    else if(!person)
      callback("ERROR", { statusCode: 0 ,  additionalInfo: 'User not  Found' });
    else
      callback(null, person);
  });
};

exports.getDoxs = function(phoneID, callback){
  User.findOne({ 'phoneID': phoneID }, 'doxs', function (err, person) {
    if (err) return handleError(err);
    else if(!person){
      callback("ERROR", { statusCode: 0 ,  additionalInfo: 'User not  Found' });
    }else
    callback(null, person.doxs);
  });
};

var putDoxs = exports.putDoxs = function(payload, callback){
      console.log('payload update dox');
  async.waterfall([

    //consultar doxs en utiba
    function(callback){
      console.log('the sessionid: '+payload.sessionid);
        balance.balanceFlow(payload.sessionid, function(err, result) {
          if(err){
            callback('ERROR', response);
          }
          else{
            console.log("\n\nDoxes en UTIBA: "+result.additionalInfo.dox);
            callback(null, result.additionalInfo.dox);
          }
        });
    },

    //salvar numero de doxs en mongo
    function(doxs, callback){

      var query = { 'phoneID': payload.phoneID };
      var update = { 'doxs': doxs };
      var options = { new: false };
      User.findOneAndUpdate(query, update, options, function (err, person) {
        if (err){
          callback("ERROR", { statusCode: 1 ,  additionalInfo: err });
        }
        else if(!person)
          callback("ERROR", { statusCode: 1 ,  additionalInfo: 'User not  Found' });
        else
          callback(null, person.doxs);
      });

    }

    ], function (err, result) {
      if(err){
        callback(err,result);
      }else{
        callback(null,result);
      }
    });
};

exports.confirmPin = function(phoneID, callback){
  console.log('Confirm Pin');
  console.log(phoneID);
  User.findOne({ 'phoneID': phoneID }, 'pin email company name profileCompleted', function (err, person) {
    if (err) return handleError(err);
    else if(person){
      console.log(person);
      callback(null, person);
    }
    else{
      console.log("user not found");
      callback("USER NOT FOUND", null);
    }
  });
};

exports.getUsers = function(parameters,callback){
  if(parameters.phoneID){
    User.findOne({'phoneID': parameters.phoneID }, 'group', function (err, user) {
      if (err) return handleError(err);
      else if(user){
        /*User.find({group:user.group }, 'phoneID name email lastSession company', { sort : { name : 1 }}, function (err, people) {
          if (err) return handleError(err);
          else if(people){
            people.sort(sortstring);
            callback(null, people);
          }
          else{
            console.log("users not found");
            callback("USERS NOT FOUND", null);
          }
        });*/
        getUsersByTeam(function(err,result){
          callback(null,result);
        });
      }// end else if
      else{
        User.find({}, 'phoneID name email lastSession company', { sort : { name : 1 }}, function (err, people) {
          if (err) return handleError(err);
          else if(people){
            people.sort(sortstring);
            callback(null, people);
          }
          else{
            console.log("users not found");
            callback("USERS NOT FOUND", null);
          }
        });
      }
    });
  }//end of if
  else{
    User.find({group:'INTERNAL'}, 'phoneID name email lastSession company', { sort : { name : 1 }}, function (err, people) {
      if (err) return handleError(err);
      else if(people){
        callback(null, people);
      }
      else{
        console.log("users not found");
        callback("USERS NOT FOUND", null);
      }
    });
  }//end else
};

exports.getName = function(phoneID,callback){
  console.log('Search user in mongoDB');
  console.log(phoneID);
  User.findOne({ 'phoneID': phoneID }, 'name', function (err, person) {
    if (err) return handleError(err);
    else if(!person)
      callback("ERROR", { statusCode: 0 ,  additionalInfo: 'User not  Found' });
    else
      callback(null, person);
  });
};

exports.updateSession = function(user, callback) {
  console.log( 'Adding timestamp to session' );
  var now = moment().tz(process.env.TZ).format().replace(/T/, ' ').replace(/\..+/, '').substring(0,19);;
  User.update( { 'phoneID' : user.phoneID }, { $set : { 'lastSession' : now } }, function(err, result) {
    if (err)
      callback('ERROR', { message: 'Failed updating session' });
    else
      callback(null, { message: 'Successful updating session' });
  });
};

exports.getLeaderboard = function(phoneIDUser,callback){

  if(phoneIDUser){
      console.log( 'by phoneID' );
    User.findOne({phoneID:phoneIDUser},'group',function(err,result){
      if (err)
        callback('ERROR', { message: 'Fail  getLeaderboard' });
      else{
        if(result.group){
          var query = User.find({group:result.group}, 'phoneID name doxs', {sort: {doxs: -1}});
          query.limit(20);
          query.exec(function (err, people) {
            if (err) return handleError(err);
            else if(people){
              callback(null, people);
            }
            else{
              console.log("users not found");
              callback("USERS NOT FOUND", null);
            }
          });
        }else{
          callback(null,[]);
        }
      }
    });
  }else{
      console.log( 'by merchantID' );
    merchantQuery.getMerchantByID(1,function(err,result){
      if (err)
        callback('ERROR', { message: 'Fail  getLeaderboard' });
      else{
        if(result.group){
          var query = User.find({group:result.group}, 'phoneID name doxs', {sort: {doxs: -1}});
          query.limit(15);
          query.exec(function (err, people) {
            if (err) return handleError(err);
            else if(people){
              callback(null, people);
            }
            else{
              console.log("users not found");
              callback("USERS NOT FOUND", null);
            }
          });
        }else{
          callback(null,[]);
        }
      }
    });
  }
};

exports.inviteFriend = function(payload, callback){

console.log('invite friend');

  async.waterfall([

    function(callback){
      var fecha = moment().tz(process.env.TZ).format().replace(/T/, ' ').replace(/\..+/, '').substring(0,19);;

      var pattern = "^"+fecha[0];
      var re = new RegExp(pattern);

      var query = {$and: [{'operation':'INVITE'},
                          {'phoneID':payload.phoneID},
                          {'date':re}]};

      transacction.find(query, function(err, trans){
        console.log('Result: '+trans);
        if(trans.length<5){
          callback(null);
        }else{
          callback({statusCode:2, additionalInfo:config.messages.inviteError}, null);
        }
      });
    },

    function(callback){
      User.findOne({'phoneID': payload.phoneID }, 'group name', function (err, user) {
        console.log('Enviroment: '+user.group);
        callback(null, user.group, user.name);
      });
    },

    function(env, name, callback){
      enviromentQuery.getUrl(env, function(err, result) {
        console.log('URL: '+result)
        callback(null, result, name);
      });
    },

    function(url, name, callback){
      payload.url = url;
        payload.sender = name;
      mailService.sendInvitation(payload,function(err,result){
        if (err) callback('ERROR', {statusCode:1, additionalInfo:err});
        callback(null);
      });
    },

    function(callback){
      var payloadoxs = {phoneID: payload.phoneID, action: 'social', type: 3}
      doxsService.saveDoxs(payloadoxs, function(err, result){
        console.log('Transfer result: '+JSON.stringify(result)+'\n\n');
        if(err) {
          return new Error(err);
        } else {
          callback(null);
        }
      });
    },

    function(callback){
      var updateDoxs = {phoneID: payload.phoneID, operation: 'social', sessionid:payload.sessionid};
      console.log('Saving doxs in mongo');
      Userquery.putDoxs(updateDoxs, function(err,result){
        callback(null);
      });
    },

    function(callback) {
        console.log( 'Saving transaction in mongo' );
        var transacction = {};
        transacction.title = 'Friend invited';
        transacction.type = 'DOX',
        transacction.date = moment().tz(process.env.TZ).format().replace(/T/, ' ').replace(/\..+/, '').substring(0,19);;
        transacction.amount = config.doxs.invite;
        transacction.operation = 'INVITE';
        transacction.phoneID = payload.phoneID;
        transacction.description ='Invited a friend to install amdocs wallet';
        transacctionQuery.createTranssaction(transacction, function(err, result) {
            if (err)
                callback('ERROR', err);
            else{
                console.log(result);
                callback(null);
            }
        });
    },

    function(callback){
      console.log('balance e-wallet');
      sessionid = payload.sessionid;
      var request = { sessionid: sessionid, type: 1  };
      request = {balanceRequest: request};
      soap.createClient(soapurl, function(err, client) {
        client.balance(request, function(err, result) {
          if(err) {
            return new Error(err);
          } else {
            response = result.balanceReturn;
            if(response.result  === '0' )
              response = { statusCode:0 ,sessionid : sessionid ,  additionalInfo : response };
            else
              response = { statusCode:1 ,  additionalInfo : response };

            callback(null, response);
          }
        });
      });
    },

  ], function (err, result) {
    if(err){
      callback(err,result);
    }else{
      callback(null,result);
    }
  });
};

exports.getSocialNetworks = function(phoneID, callback){
  console.log("getSocialNetworks: "+phoneID);
  User.findOne({ 'phoneID': phoneID }, 'phoneID twitter facebook', function(err, social){
    callback(null, social);
  })
};

exports.setSocialNetworks = function(payload, callback){
  console.log("setSocialNetworks: "+JSON.stringify(payload));
  var conditions = { 'phoneID': payload.phoneID }
  payload = payload.social == 'twitter' ? {'twitter':'1'} : {'facebook':'1'};
  User.update(conditions, payload, null, function(err, result) {
    console.log(result);
    callback(null);
  });
}

var sortstring = function (a, b)    {
    a = a.name.toLowerCase();
    b = b.name.toLowerCase();
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
}

function getUsersByTeam(callback){
   async.waterfall([

    //Get all users that start name with 'TEAM'
    function(callback){
      var conditionsIncludeTeam= { name: /Team/ };
      var includeTeamQuery = User.find(conditionsIncludeTeam,'phoneID name email lastSession company');
      includeTeamQuery.sort({name: 1});
      includeTeamQuery.exec(function (err1, usersTeam) {
        console.log('Users with Team');
        console.log(usersTeam);
        callback(null,usersTeam);
      });
    },

    //Get all users that start name different 'TEAM'
    function(usersTeam, callback){
      var conditionsNotIncludeTeam = {name: {"$not": /Team/}};
      var usersQuery = User.find(conditionsNotIncludeTeam,'phoneID name email lastSession company');
      usersQuery.sort({name: 1});
      usersQuery.exec(function (err1, usersWithoutTeam) {
        callback(null, usersTeam.concat(usersWithoutTeam));
      });
    },

    ], function (err, result){
        callback(null,result);
    });
}
