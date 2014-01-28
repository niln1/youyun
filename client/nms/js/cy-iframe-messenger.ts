/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />

import CyEvents = require('./cy-events');


/**
 * @class CyIFrameMessenger
 * @module CyCore
 */
class CyIFrameMessenger extends CyEvents.CyEventManager {

    /**
     * Initializes the class and sets the callback if supplied
     * @constructor
     */
        constructor() {

        super();

        window.addEventListener('message', $.proxy(this.onMessage, this));
    }

    /**
     * message event listener
     * @method onMessage
     * @param e
     * @private
     */
    private onMessage(e) {

        var data = JSON.parse(e.data);
        var event = data.event;
        var payload = data.payload;

        if (event === CyIFrameMessenger.kEVENT_PING) {

            this.sendMessage(CyIFrameMessenger.kEVENT_ACK);

        } else if (event === CyIFrameMessenger.kEVENT_ACK_RCV) {

            this.trigger(CyIFrameMessenger.kEVENT_INITIALIZED, null, true);

        } else if (event === CyIFrameMessenger.kEVENT_CLOSE) {

            this.trigger(CyIFrameMessenger.kEVENT_CLOSE, null, true);

            this.sendMessage(CyIFrameMessenger.kEVENT_CLOSED);

        } else {

            this.trigger(event, payload, true);

        }

    }

    /**
     * Override the default trigger to also send message to the parent window if necessary
     * @param message
     * @param payload
     * @param local
     */
    public trigger(message:String, payload?:any, local:boolean = false) : void {

        super.trigger(message, payload);

        if (!local) {

            this.sendMessage(message, payload);
        }

    }

    /**
     * thin wrapper to postMessage
     * @method sendMessage
     * @param message
     * @param payload
     */
    public sendMessage(message:String, payload?:any) {

        payload = _.clone(payload);

        // this will be overridden on the master side

        if (payload && 'sender' in payload) {
            delete payload['sender'];
        }

        _.each(payload, function (value:any, key?:string) {


            // strip object key if necessary

            if (!_.isNumber(value) && !_.isString(value)) {

                delete payload[key];

            }

        });


        window.parent.postMessage(JSON.stringify({
            event: message,
            payload: payload
        }), '*');

    }

    /**
     * single instance
     * @static
     * @private
     */
    private static instance:CyIFrameMessenger;


    /**
     * get singleton instance
     * @static
     * @public
     */
    public static get I():CyIFrameMessenger {

        if (!CyIFrameMessenger.instance) {

            CyIFrameMessenger.instance = new CyIFrameMessenger();

        }

        return CyIFrameMessenger.instance;

    }

    /**
     * sent when ack-rcv is received
     * @event
     */
    public static kEVENT_INITIALIZED = 'iframe-msg-initialized';

    /**
     * sent when manager request a close
     * @event
     */
    public static kEVENT_CLOSE = 'iframe-msg-close';

    /**
     * sent when iframe has finished cleaning up
     * @event
     */
    public static kEVENT_CLOSED = 'iframe-msg-closed';

    /**
     * sent when manager initiates a handshake
     * @event
     */
    public static kEVENT_PING = 'iframe-msg-ping';

    /**
     * sent when ping is received
     * @event
     */
    public static kEVENT_ACK = 'iframe-msg-ack';

    /**
     * sent when manager receives ack from us
     * @event
     */
    public static kEVENT_ACK_RCV = 'iframe-msg-ack-rcv';

}

export = CyIFrameMessenger;
