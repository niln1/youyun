
exports.route = function (socket) {
	socket.on('update-student-pickup-info', function (data) {
		/*
		console.log(data);
		User.find({}, function (user) {
			user.needPickup = false;
			user.save(function (done) {
				socket.emit('success')
			})
		})
		*/
	});
}