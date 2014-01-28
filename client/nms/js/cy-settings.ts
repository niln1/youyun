/// <reference path="./definitions/amplify.d.ts" />
/// <reference path="./definitions/underscore.d.ts" />

class CySettings {

    /**
     * singleton instance for the app class. Access via the I() public/static method
     *
     * @method I
     * @return {CyCore.CyApp} A singleton instance of the application.
     */
    private static instance:CySettings;
    public static get I():CySettings {

        return CySettings.instance || (CySettings.instance = new CySettings());
    }


    /**
     * construct with the storage key for this settings object.
     * @param key
     */
        constructor() {

        // construct from storage or create empty object

        this.settings = amplify.store(CySettings.kKEY) || {};

    }

    private static kKEY:string = "cyan-settings";

    /**
     * read a value from the settings object, set and return the defaultValue
     * if not present
     * @param key
     */
    public read(valueKey:string, defaultValue?:any) : any {

        // if key is present in settings then return it

        if (this.settings[valueKey]) {
            return this.settings[valueKey];
        }

        // set and return the default value if present
        if (defaultValue) {
            this.settings[valueKey] = defaultValue;

            this.save();

            return defaultValue;
        } else {

            return null;
        }
    }

    /**
     * overwrite / create a key value pair
     * @param valueKey
     * @param value
     */
    public write(valueKey:string, value:any) : void {

        this.settings[valueKey] = value;

        this.save();
    }

    /**
     * remove a key value pair
     * @param valueKey
     * @param value
     */
    public remove(valueKey:string) : void {

        delete this.settings[valueKey];

        this.save();
    }    

    /**
     * save the settings. This is done automatically whenever a value is written
     */
    private save() : void {

        amplify.store(CySettings.kKEY, this.settings);
    }

    private settings:any;
}

export = CySettings;
