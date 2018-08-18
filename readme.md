## How to setup

make sure your system have
 - Node > 10
 - Postgresql
 - Enable PostGIS extension
 - DB configs are present /config/config.json 
  

clone the repo directory
```
npm install
npm run prod
./node_modules/.bin/sequelize db:migrate
pm2 start config/pm2
```
The google oauth is configugred for port 5050

To load data
```
node ./services/load.js data #loads the GPS updated data
node ./services/load.js xml 20 #loads last 20 page infomation
```


http://localhost:5050/

You should be good