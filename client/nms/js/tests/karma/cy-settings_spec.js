define(['cy-settings'], function (CySettings) {
	var instance = CySettings.I;
	var testKey = 'test-key';

	describe('CySettings', function(){
		it('should be able to read settings', function(done){
			expect(instance.read(testKey)).to.be.null;
			expect(instance.read(testKey, 'default')).to.equal('default');
			expect(instance.read(testKey)).to.equal('default');
			done();
		});

		it('should be able to write settings', function(done){
			instance.write(testKey, 'written');
			expect(instance.read(testKey)).to.equal('written');
			done();
		});

		it('should be able to remove settings', function(done) {
			expect(instance.read(testKey)).to.not.be.null;
			instance.remove(testKey);
			expect(instance.read(testKey)).to.be.null;
			done();
		});
	});
});