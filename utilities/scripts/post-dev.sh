#!/bin/bash

PID_FILE=".dev-pid"

# kills any pids stored in the pid file
kill_pids () {
    cat "${PID_FILE}" | while read pid; do
        kill -9 $pid &> /dev/null
    done
    cat /dev/null > "${PID_FILE}"
}

kill_pids