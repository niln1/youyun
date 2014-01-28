
/// <reference path="./definitions/require.d.ts"/>
/// <amd-dependency path="login-form" />


class A {
	start () {
		var loginForm = require("login-form");
		console.log(loginForm);
	}
}

var test = new A();
test.start();

export = A;
