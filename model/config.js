// Configuration file
var config = {};

config.orders = {};
config.orders.status = 'Open';
config.orders.errMsg = 'Something went wrong';
config.orders.emptyMsg = 'There are no ' + config.orders.status + ' orders';

config.loans = {};
config.loans.status = 'New';
config.loans.errMsg = 'Something went wrong';
config.loans.emptyMsg = 'There are no ' + config.loans.status + ' loans';

config.products = {};
config.products.status = 'In Stock';
config.products.errMsg = 'Something went wrong';
config.products.emptyMsg = 'There are no products ' + config.products.status;

config.doxs = {};
config.doxs.p2p = 500;
config.doxs.pic = 200;
config.doxs.checkin = 300;
config.doxs.linking = 100;
config.doxs.payment = 500;
config.doxs.social = 500;
config.doxs.trivia = 100;

module.exports = config;
