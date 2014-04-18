define(["require", "exports"], function(require, exports) {
    var LocalStorage = (function () {
        function LocalStorage() {
            this.settings = amplify.store(LocalStorage.kKEY) || {};
        }
        Object.defineProperty(LocalStorage, "I", {
            get: function () {
                return LocalStorage.instance || (LocalStorage.instance = new LocalStorage());
            },
            enumerable: true,
            configurable: true
        });

        LocalStorage.prototype.get = function (valueKey, defaultValue) {
            if (this.settings[valueKey]) {
                return this.settings[valueKey];
            }

            if (defaultValue) {
                this.settings[valueKey] = defaultValue;

                this.save();

                return defaultValue;
            } else {
                return null;
            }
        };

        LocalStorage.prototype.set = function (valueKey, value) {
            this.settings[valueKey] = value;

            this.save();
        };

        LocalStorage.prototype.remove = function (valueKey) {
            delete this.settings[valueKey];

            this.save();
        };

        LocalStorage.prototype.save = function () {
            amplify.store(LocalStorage.kKEY, this.settings);
        };
        LocalStorage.kKEY = "local-storage";
        return LocalStorage;
    })();

    
    return LocalStorage;
});
