
exports.route = function (socket) {
	socket.on('pickup::parents::add-absence', function (data) {
		console.log(data);
		// User.find({}, function (user) {
		// 	user.needPickup = false;
		// 	user.save(function (done) {
		// 		socket.emit('success')
		// 	})
		// })
	});
}