#!/bin/bash

screen -ls | grep \( | grep -o '[0-9]\+' | while read pid; do kill "$pid"; done

screen -dmS MongoDB
screen -p 0 -S MongoDB -X eval 'stuff "mongod\015"'

screen -dmS Redis
screen -p 0 -S Redis -X eval 'stuff "redis-server\015"'

screen -dmS WatchTs
screen -p 0 -S WatchTs -X eval 'stuff "grunt watch:ts\015"'

screen -dmS WatchSass
screen -p 0 -S WatchSass -X eval 'stuff "grunt watch:css\015"'

screen -dmS WatchViews
screen -p 0 -S WatchViews -X eval 'stuff "grunt watch:views\015"'

screen -dmS WatchAssets
screen -p 0 -S WatchAssets -X eval 'stuff "grunt watch:others\015"'