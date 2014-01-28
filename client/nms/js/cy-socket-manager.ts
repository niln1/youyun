/// <reference path="./definitions/socket.io.d.ts" />
import CyApp = require('./cy-app');

class CySocketManager {

    private socket;
    private active = false;

    constructor() {

        this.socket = io.connect('/');

        this.socket.on('alarm_changes', (data) => {
            CyApp.I.eventBus.trigger(CySocketManager.kALARMS_CHANGED, {
                sender: this,
                data: data
            });
        });
    }

    public destroy() {

        this.stopAlarms();

    }

    public pollAlarms() {

        this.socket.emit('alarm_request_made', {
            url: '/api/v1/alarms',
            query: {index: 0, count: 25, m: 'get'}
        });

        this.active = true;

    }

    public stopAlarms() {

        if (this.active) {
            this.socket.emit('stop_alarms');
            this.active = false;
        }

    }

    public static kALARMS_CHANGED = 'cyan-socket-alarms-changed';

}

export = CySocketManager;
