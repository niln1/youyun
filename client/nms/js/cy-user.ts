/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />


/**
 * holds the state of the logged in user.
 *
 * @module CyCore
 * @class CyUser
 */
class CyUser {
    /**
     * start a login request. The callback is invoked with the parameters: this ( CyUser ), true/false, if false a message giving the reason
     *
     * @method doLogin
     * @param {String} username
     * @param {String} password
     * @param {Function} callback
     */
    public doLogin(username:string, password:string, callback:(user:CyUser, result:boolean, message?:string) => void):void {

        // as soon as called invalid the current user data, if any

        this.userData = null;

        $.ajax({
            type: "POST",
            url: '/api/v1/accounts/login',
            data: {
                username: username,
                password: password
            },
            dataType: "json",

            // login successful

            success: $.proxy(function (data, textStatus, jqXHR) {

                if (data.result) {

                    // save user data ( this should match the object returned by getuser )

                    this.userData = data;

                    // inform caller of success

                    callback(this, true);

                } else {

                    callback(this, false, data.message);
                }

            }, this),

            // login failed

            error: $.proxy(function (jqXHR, textStatus, errorThrown) {

                callback(this, false, textStatus);

            }, this)
        });
    }


    /**
     * this is the object returned by the login / get user API e.g.
     * {"source": "Planet Operate Web Server", "message": {"user_id": 1, "user_name": "admin"}, "result": true, "description": "Authenticated User"}
     *
     * @property {Object} userData
     * @private
     */
    private userData:any;

    /**
     * return the user ID if we have a logged in user. Return -1 if we don't
     *
     * @method userID
     * @return {Number} uid
     */
    public get userID():number {

        if (this.userData) {
            return this.userData.message.user_id;
        }

        return -1;
    }

    /**
     * return the user name if we have a logged in user. Return -1 if we don't
     *
     * @method userName
     * @return {String} username
     */
    public get userName():string {

        if (this.userData) {
            return this.userData.message.user_name;
        }

        return null;
    }
}

export = CyUser
