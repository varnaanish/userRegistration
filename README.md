# profileInfo



## How to configure Mysql wiwth nodejs app
* Create 'profile' databse into mysql server.
* Import users.sql table file into test database.
* Add database parameters into this file
 
```
CREATE TABLE `users` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `full_name` text NOT NULL,
  `email` varchar(20) NOT NULL,
  `password` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
```

#Test nodejs application
open http://project_name:4200 on browser.

### Prerequisite
Node js (v0.12.3 or greater)