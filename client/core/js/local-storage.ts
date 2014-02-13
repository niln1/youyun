/// <reference path="vendor/amplify/amplify.d.ts" />
/// <reference path="vendor/underscore/underscore.d.ts" />

class LocalStorage {

    /**
     * singleton instance for the app class. Access via the I() public/static method
     *
     * @method I
     * @return {CyCore.CyApp} A singleton instance of the application.
     */
    private static instance:LocalStorage;
    public static get I():LocalStorage {

        return LocalStorage.instance || (LocalStorage.instance = new LocalStorage());
    }


    /**
     * construct with the storage key for this settings object.
     * @param key
     */
    constructor() {

        this.settings = amplify.store(LocalStorage.kKEY) || {};
    }

    private static kKEY:string = "local-storage";

    /**
     * read a value from the settings object, set and return the defaultValue
     * if not present
     * @param key
     */
    public get(valueKey:string, defaultValue?:any) : any {

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
    public set(valueKey:string, value:any) : void {

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

        amplify.store(LocalStorage.kKEY, this.settings);
    }

    private settings:any;
}

export = LocalStorage;
