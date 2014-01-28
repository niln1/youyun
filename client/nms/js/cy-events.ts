
import CyUtils = require('./util/cy-utils')

/**
 * CyEventManager class
 *
 * @module CyEvents
 * @class CyEventManager
 */
export class CyEventManager {

    /**
     * Constructor
     *
     * @class CyEventManager
     * @constructor
     */
    constructor() {

        // dictionary of messages by message name

        this.messages = {};

        // maps allocated ID's to messages

        this.idToMessage = {};

        // next subscription ID to use

        this.nextID = 0;

    }

    /**
     * subscribe to all messages and return the ID of the subscription
     *
     * @method all
     * @param callback
     * @returns {number}
     */
    public all(callback:(message:String, payload?:any) => void):number {

        return this.onInternal('*', callback, false);

    }

    /**
     * subscribe to the given message and return the ID of the subscription
     *
     * @method on
     * @param {String} message
     * @param {Function} callback
     */
    public on(message:String, callback:(payload?:any) => void):number {

        return this.onInternal(message, callback, false);

    }

    /**
     * subscribe to the given message once only
     * 
     * @method once
     * @param {String} message
     * @param {Function} callback
     */
    public once(message:String, callback:(payload?:any) => void):number {

        return this.onInternal(message, callback, true);

    }

    /**
     * add a subscription. Used by both 'on' and 'once'
     *
     * @method onInternal
     * @param {String} message
     * @param {Function} callback
     * @param {boolean} once
     * @returns {number}
     * @private
     */
    private onInternal(message:String, callback:(...args:any[]) => void, once:boolean):number {


        // create a message manager for this message if not already created

        var m:Message = this.messages[message];

        if (!m) {

            m = this.messages[message] = new Message(message);
        }

        // add to the subscriptions

        m.subscriptions[this.nextID] = new Subscription(this.nextID, callback, once);

        // map the allocated ID to its message so we can quickly locate by ID only

        this.idToMessage[this.nextID] = m;

        // return the ID that was actually allocated and auto-increment

        return this.nextID++;
    }


    /**
     * remove the message handler by ID
     *
     * @method off
     * @param {number} id
     */
    public off(id:number):void {

        CyUtils.assert(_.isNumber(id) && id >= 0, "Excepted a positive number as the token");

        // location the message by ID

        var m:Message = this.idToMessage[id];

        // remove record

        this.idToMessage[id] = null;

        m.subscriptions[id] = null;

    }

    /**
     * Removes all message handlers
     */
    public allOff():void {

        _.each(this.idToMessage, (message, id?:any) => {
            this.off(id);
        });
    }

    /**
     * trigger all handlers of the message, remove any that were added with the 'once' method
     *
     * @method trigger
     * @param {String} message
     * @param {Object} payload
     */
    public trigger(message:String, payload?:any) : void {

        // iterate the subscriptions for this message, if any

        var m:Message = this.messages[message];

        if (m) {

            // iterate each subscription to to

            for(var i = 0; i < m.subscriptions.length; i += 1) {

                var s:Subscription = m.subscriptions[i];

                if (s) {

                    s.callback(payload);

                    if (s.once) {
                        this.off(s.id);
                    }
                }
            }
        }

        // send to subscribers of all

        this.triggerAll(message, payload);

    }

    /**
     * trigger all handlers for the all message
     * @method triggerAll
     * @param payload
     */
    private triggerAll(message:String, payload?:any) : void {

        // iterate the subscriptions for this message, if any

        var m:Message = this.messages['*'];

        if (m) {

            // iterate each subscription to to

            for(var i = 0; i < m.subscriptions.length; i += 1) {

                var s:Subscription = m.subscriptions[i];

                if (s) {

                    s.callback(message, payload);

                }
            }
        }
    }

    /**
     * dictionary of messages that currently have subscriptions
     *
     * @property messages
     * @type Object
     * @private
     */
    private messages:any;

    /**
     * maps ID's to messages
     *
     * @property idToMessage
     * @type Object
     * @private
     */
    private idToMessage:any;

    /**
     * next ID to issue
     *
     * @property nextID
     * @type Number
     * @private
     */
    private nextID:number;

}

/**
 * simple list manager for a set of event handler ID's and an event manager. Allows you to easily '.off' a set
 * of events
 *
 * @module CyEvents
 * @class EventIDList
 */
export class EventIDList {

    constructor(private eventManager) {

    }

    /**
     * add event token to our list
     *
     * @method add
     * @param id
     */
    public add(id:number) {

        CyUtils.assert(_.isNumber(id) && id >= 0, "Invalid Token");

        if (!this.list) {
            this.list = [];
        }

        this.list.push(id);
    }

    /**
     * release all event handlers
     *
     * @method allOff
     */
    public allOff() {

        _.each(this.list, (id:number) => {
            this.eventManager.off(id);
        });

        delete this.list;
    }

    private list:number[];
}


/**
 * handles all the subscriptions for a given message
 *
 * @module CyEvents
 * @class Message
 */
class Message {

    /**
     * 
     * @class Message
     * @constructor
     * @param name
     */
    constructor(public name:String) {

        this.subscriptions = [];

    }

    public subscriptions:Subscription[];
}
/**
 * an individual subscription to a message
 *
 * @module CyEvents
 * @class Subscription
 */
class Subscription {

    /**
     * 
     * @class Subscription
     * @constructor 
     * @param id
     * @param callback
     * @param once
     */
    constructor(public id, public callback:(...args:any[]) => void, public once:boolean) {

    }
}