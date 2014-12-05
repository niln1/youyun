// postInstall.js
var isClient = process.env.CLIENT_ENV;

if (isClient === 'client') {
    // Spawn a process or require the Gruntfile directly for the default task.
    console.error('No task for environment:', isClient);
    return;
} else {
	// is Server Cp the server config file
	var fs = require('fs');
	var targetFile = './server/utils/config.json';
	var sourceFile = './utilities/config.dokku.json';
	fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));
	console.log('config file for Server Updated');
	var mkdirp = require('mkdirp');
	mkdirp.sync('./utilities/output');
	console.log('Output Dir Created');
	return;
}