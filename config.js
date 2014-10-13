var config = {};

config.orders = {};
config.orders.status = 'NEW';
config.orders.errMsg = 'Something went wrong';
config.orders.emptyMsg = 'There are no ' + config.orders.status + ' orders';

config.loans = {};
config.loans.status = {NEW : 'NEW' ,ACCEPTED : 'ACCEPTED' , REJECTED : 'REJECTED' };
config.loans.errMsg = 'Something went wrong';
config.loans.emptyMsg = 'There are no ' + config.loans.status + ' loans';

config.products = {};
config.products.status = 'IN STOCK';
config.products.errMsg = 'Something went wrong';
config.products.emptyMsg = 'There are no products ' + config.products.status;
config.products.emptyInventory = 'The inventory is empty';

config.merchants = {};
config.merchants.errMsg = 'Something went wrong';
config.merchants.emptyMsg = 'merchant not found ';

config.S3 = {};
config.S3.url = 'https://s3-us-west-1.amazonaws.com/amdocs-images/profile/';

config.messages = {};
config.messages.status = { READ : 'READ' ,NOTREAD : 'NOTREAD'};
config.messages.type = { TRANSFER:'TRANSFER' , GIFT : 'GIFT' , BUY :'BUY' ,LOAN :'LOAN' };
config.messages.transferMsg = 'You have received a transfer of € ';
config.messages.giftMsg = 'You have received a coffee gift!!!';
config.messages.loanRequestMsg = 'There are new request loan for € ';
config.messages.loanRejectedMsg = 'Build up your Dox score to be elegible for a loan';
config.messages.action = {TRANSFER:1 , GIFT :2 , BUY :3 ,LOAN : 4 };

config.messages.twitter = 'I just bought a coffee !!!!'
config.messages.facebook ={ name:'I just bought a coffee', caption:'I just bought a coffee', description:'I just bought a coffee', link:'I just bought a coffee',picture:'I just bought a coffee'};
config.doxs = {};
config.doxs.p2p = 500;
config.doxs.gift = 500;
config.doxs.pic = 200;
config.doxs.checkin = 300;
config.doxs.linking = 100;
config.doxs.payment = 500;
config.doxs.social = 500;
config.doxs.trivia = 100;

config.conn = {};
config.username = 'anzen_01';
config.pin = '1234';

module.exports = config;
