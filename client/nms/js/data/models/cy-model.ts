/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />

/**
 * CyModel serves as a general wrapper around a Javascript literal object.  It is meant to be used as a helper to
 * retrieve content from the data or prepare the data for update to the server.
 */
class CyModel {

    /**
     * Constructs the model with the data passed in
     * @param data
     */
    constructor(data?:any) {

        this._data = data;
    }

    /**
     * models internal data
     */
    private _data:any;

    /**
     * get model data
     * @returns {*}
     */
    public get data() : any {
        return this._data;
    }

    /**
     * set model data
     * @param value
     */
    public set data(value : any) {
        this._data = value;
    }

    /**
     * Simplifies supplied_parameters of the data model so traversing it is a little easier to deal with.
     *
     * @param base
     * @returns {{}}
     */
    public simplifyParameters(base?:any) {

        if (!base) {
            base = this.data;
        }

        var result = {};

        if (!_.isArray(base)) {
            return result;
        }

        _.each(base, (element) => {

            var key = element.nv_name;
            var value = element.nv_value;

            // element is of type sp_namevalue

            if (element.__name != 'sp_namevalue')
                return;


            if (element.nv_type == 'collection_t') {

                // handle nested sp_namevalue

                value = this.simplifyParameters(element.nv_collection);

            } else if (element.nv_type == 'bool_t') {

                value = (element.nv_value == "True");

            }

            // if the element name already exist, then convert this from an object to an array
            if (key in result) {

                // keep existing object
                var existing = result[key];

                // the property is converted to an array
                result[key] = [];
                result[key].push(existing);
                result[key].push(value);
            } else {
                result[key] = value;
            }
        });

        return result;
    }
}

export = CyModel;