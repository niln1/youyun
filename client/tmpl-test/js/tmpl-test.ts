
/// <reference path="./definitions/require.d.ts"/>
/// <amd-dependency path="complex" />
/// <amd-dependency path="inner/complex" />

class A {
	start () {
		var template = require("complex");		
		var innerTemplate = require("inner/complex");
	}
}

export = A;
