#!/bin/bash

kill -9 $(lsof -i:3000 -t) 2> /dev/null
kill -9 $(lsof -i:6379 -t) 2> /dev/null

killall SCREEN 2> /dev/null
killall screen 2> /dev/null

screen -dmS MongoDB
screen -p 0 -S MongoDB -X eval 'stuff "mongod\015"'

screen -dmS Redis
screen -p 0 -S Redis -X eval 'stuff "redis-server\015"'

screen -dmS WatchTs
screen -p 0 -S WatchTs -X eval 'stuff "grunt watch:ts\015"'

screen -dmS WatchSass
screen -p 0 -S WatchSass -X eval 'stuff "grunt watch:css\015"'

screen -dmS WatchTmpl
screen -p 0 -S WatchTmpl -X eval 'stuff "grunt watch:tmpl\015"'

screen -dmS WatchAssets
screen -p 0 -S WatchAssets -X eval 'stuff "grunt watch:others\015"'