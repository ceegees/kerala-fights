## How to setup

make sure your system have
 - Node > 10
    - windows user please check out below
    - http://blog.teamtreehouse.com/install-node-js-npm-windows
 - Postgresql
    - windows user check out below 
    - https://www.postgresql.org/download/windows/
    - The graphical installer by BigSql works like a charm
    - If you already have a working postgres in your environment you can edit the settings at server/config/config.js
 - Enable PostGIS extension
    open pgAdmin
    select (click) your database
    click "SQL" icon on the bar
    run "CREATE EXTENSION postgis;" code

Now that your local environment is ready
  
Go ahead and clone the repo directory


```
npm install
npm run prod
```

To load data
```
./node_modules/.bin/sequelize db:migrate
node ./services/load.js data #loads the GPS updated data
node ./services/load.js xml 20 #loads last 20 page infomation
```

 - DB configs are present /config/config.json 

#Below is only applicable to Mac users
pm2 start config/pm2
```
The google oauth is configured for port 5050

To start the Node engine 

```
node bin/www
 ```
The url is ready to be accessed at 
http://localhost:5050/

You should be good