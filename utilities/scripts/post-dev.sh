#!/bin/bash

kill -9 $(lsof -i:3000 -t) 2> /dev/null
kill -9 $(lsof -i:6379 -t) 2> /dev/null

killall SCREEN 2> /dev/null
killall screen 2> /dev/null