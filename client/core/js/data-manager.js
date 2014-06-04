define(["require",
    "exports",
    './models/reminder-list-collection',
    './models/account-model',
    './models/user-list-collection'],
    function (require, exports, ReminderListCollection, AccountModel, UserListColection) {
        var ClassListColection = require("./models/class-list-collection");

        var DataManager = (function () {
            function DataManager() {
                this.resources = {};
            }
            Object.defineProperty(DataManager, "I", {
                get: function () {
                    if (!DataManager.instance)
                        DataManager.instance = new DataManager();
                    return DataManager.instance;
                },
                set: function (I) {
                    DataManager.instance = I;
                },
                enumerable: true,
                configurable: true
            });


            DataManager.prototype.getReminderListCollection = function () {
                if (!this.resources["reminder-list-collection"]) {
                    this.addResource("reminder-list-collection", new ReminderListCollection(), true);
                }
                return this.resources["reminder-list-collection"];
            };

            DataManager.prototype.getAccountModel = function () {
                if (!this.resources["account-model"]) {
                    this.addResource("account-model", new AccountModel(), true);
                }
                return this.resources["account-model"];
            };

            DataManager.prototype.getUserListCollection = function () {
                if (!this.resources["user-list-collection"]) {
                    this.addResource("user-list-collection", new UserListColection(), true);
                }
                return this.resources["user-list-collection"];
            };

            DataManager.prototype.getClassListCollection = function () {
                if (!this.resources["class-list-collection"]) {
                    this.addResource("class-list-collection", new ClassListColection(), true);
                }
                return this.resources["class-list-collection"];
            }

            DataManager.prototype.addResource = function (type, resource, fetch) {
                if (fetch) {
                    resource.fetch({
                        reset: true
                    });
                }
                this.resources[type] = resource;
            };
            return DataManager;
        })();

        return DataManager;
    }
);