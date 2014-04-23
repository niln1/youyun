define(["require",
    "exports",
    '../../config/base-item-view',
    '../../models/account-model',
    '../../data-manager',
    "./templates/user-profile-view-tmpl"],
    function (require, exports, BaseItemView, AccountModel, DataManager) {
        var UserProfileView = (function (_super) {
            __extends(UserProfileView, _super);

            function UserProfileView(options) {
                _super.call(this, options);
                this.template = require('./templates/user-profile-view-tmpl');
                this.model = DataManager.I.getAccountModel();
                this.context = this.model.attributes;

                this.events = {
                    "submit #user-image-form": "onSubmitUserImage"
                };
            };

            UserProfileView.prototype.onSubmitUserImage = function (event) {
            // event.preventDefault();
            // console.log("preventDefault");
            // var url = "path/to/your/script.php"; // the script where you handle the form input.

            // $.ajax({
            //     type: "POST",
            //     url: url,
            //     data: $("#idForm").serialize(), // serializes the form's elements.
            //     success: function (data) {
            //         alert(data); // show response from the php script.
            //     }
            // });

            };

            return UserProfileView;
        })(BaseItemView);


        return UserProfileView;
    }
);