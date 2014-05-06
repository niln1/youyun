#!/bin/bash

LOG_DIR=".dev-logs"
PID_FILE=".dev-pid"
MAC_CMDS="mongod:mongod, redis:redis-server"
NIX_CMDS="watch-css:grunt watch-css, watch-views:grunt watch-views, watch-others:grunt watch-others"

# runs a command in the background
# @param string of commands
run_cmd () {

    echo $1 | tr "," "\n" | while read cmd; do
        filename=${cmd%:*}
        command=${cmd##*:}

        # execute command and output to file matching last word in command
        ${command} &> "${LOG_DIR}/${filename}" &
        echo $! >> "${PID_FILE}"
    done
}

# kills any pids stored in the pid file
kill_pids () {
    if [ -e "${PID_FILE}" ]; then
        cat "${PID_FILE}" | while read pid; do
            kill -9 $pid &> /dev/null
        done
    fi
    cat /dev/null > "${PID_FILE}"
}

kill_pids

if [ ! -d "${LOG_DIR}" ]; then
    mkdir "${LOG_DIR}"
fi

if [ "$(uname)" == "Darwin" ]; then
    run_cmd "$MAC_CMDS"
fi

run_cmd "$NIX_CMDS"


