#!/bin/bash

screen -ls | grep \( | grep -o '[0-9]\+' | while read pid; do kill "$pid"; done