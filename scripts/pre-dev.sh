#!/bin/bash

kill -9 $(lsof -i:3000 -t) 2> /dev/null
kill -9 $(lsof -i:6379 -t) 2> /dev/null

killall SCREEN 2> /dev/null
killall screen 2> /dev/null

screen -dmS RethinkDB
screen -p 0 -S RethinkDB -X eval 'stuff "rethinkdb\015"'

screen -dmS Redis
screen -p 0 -S Redis -X eval 'stuff "redis-server\015"'