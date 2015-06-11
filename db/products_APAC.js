db = db.getSiblingDB('amdocs-barcelona'); //mongo c128.candidate.42.mongolayer.com:10128/camdocs-barcelona -u admin -p s3cr37o products_cala.js

db.products.remove({});
db.products.insert({"productID" : 1, "cost" : 10, "description" : "", "merchantId" : 1, "name" : "Mocha", "status" : "IN STOCK", "url": "https://d80mkr1efvy13.cloudfront.net/products_apac/mocha.jpg" , "schedule" : "MORNING", customerCode: 8, demonstratorCode: 37});
db.products.insert({"productID" : 2, "cost" : 8, "description" : "", "merchantId" : 1, "name" : "Americano", "status" : "IN STOCK", "url": "https://d80mkr1efvy13.cloudfront.net/products_apac/americano.jpg" , "schedule" : "MORNING", CustomerCode: 7, demonstratorCode: 38 });
db.products.insert({"productID" : 3, "cost" : 10, "description" : "", "merchantId" : 1, "name" : "Capuccino", "status" : "IN STOCK", "url": "https://d80mkr1efvy13.cloudfront.net/products_apac/capuccino.jpg" , "schedule" : "MORNING", customerCode: 5, demonstratorCode: 39 });
db.products.insert({"productID" : 4, "cost" : 10, "description" : "", "merchantId" : 1, "name" : "Ice Blended Latte", "status" : "IN STOCK", "url": "https://d80mkr1efvy13.cloudfront.net/products_apac/iceblendedtea.jpg" , "schedule" : "MORNING", customerCode: 4, demonstratorCode: 61 });
db.products.insert({"productID" : 5, "cost" : 8, "description" : "", "merchantId" : 1, "name" : "Iced Coffee", "status" : "IN STOCK", "url": "https://d80mkr1efvy13.cloudfront.net/products_apac/icedcoffee.jpg" , "schedule" : "MORNING", customerCode: 6, demonstratorCode: 63 });
db.products.insert({"productID" : 6, "cost" : 9, "description" : "", "merchantId" : 1, "name" : "Teh Tarik", "status" : "IN STOCK", "url": "https://d80mkr1efvy13.cloudfront.net/products_apac/tehtarik.jpg" , "schedule" : "MORNING", customerCode: 10, demonstratorCode: 62 });

db.discounts.remove({});
db.discounts.insert({"productID" : 1, "cost" : 5, "description" : "", "merchantId" : 1, "name" : "Mocha", "status" : "IN STOCK", "url": "https://d80mkr1efvy13.cloudfront.net/discount_product_apac/mocha.jpg" , "schedule" : "MORNING", customerCode: 8, demonstratorCode: 37 });
db.discounts.insert({"productID" : 2, "cost" : 4, "description" : "", "merchantId" : 1, "name" : "Americano", "status" : "IN STOCK", "url": "https://d80mkr1efvy13.cloudfront.net/discount_product_apac/americano.jpg" , "schedule" : "MORNING", customerCode: 7, demonstratorCode: 38 });
db.discounts.insert({"productID" : 3, "cost" : 5, "description" : "", "merchantId" : 1, "name" : "Capuccino", "status" : "IN STOCK", "url": "https://d80mkr1efvy13.cloudfront.net/discount_product_apac/capuccino.jpg" , "schedule" : "MORNING", customerCode: 5, demonstratorCode: 39 });
db.discounts.insert({"productID" : 4, "cost" : 5, "description" : "", "merchantId" : 1, "name" : "Ice Blended Latte", "status" : "IN STOCK", "url": "https://d80mkr1efvy13.cloudfront.net/discount_product_apac/iceblendedtea.jpg" , "schedule" : "MORNING", customerCode: 4, demonstratorCode: 61 });
db.discounts.insert({"productID" : 5, "cost" : 4, "description" : "", "merchantId" : 1, "name" : "Iced Coffee", "status" : "IN STOCK", "url": "https://d80mkr1efvy13.cloudfront.net/discount_product_apac/icedcoffee.jpg" , "schedule" : "MORNING", customerCode: 6, demonstratorCode: 63 });
db.discounts.insert({"productID" : 6, "cost" : 4.5, "description" : "", "merchantId" : 1, "name" : "Teh Tarik", "status" : "IN STOCK", "url": "https://d80mkr1efvy13.cloudfront.net/discount_product_apac/tehtarik.jpg" , "schedule" : "MORNING", customerCode: 10, demonstratorCode: 62 });

db.ordertemporals.remove({});
