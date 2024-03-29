;
;

var actionDescriptor;

actionDescriptor.headers = { header: 'value' };
actionDescriptor.isArray = true;
actionDescriptor.method = 'method action';
actionDescriptor.params = { key: 'value' };

var resourceClass;
var resource;
var resourceArray;

resource = resourceClass.delete();
resource = resourceClass.delete({ key: 'value' });
resource = resourceClass.delete({ key: 'value' }, function () {
});
resource = resourceClass.delete(function () {
});
resource = resourceClass.delete(function () {
}, function () {
});
resource = resourceClass.delete({ key: 'value' }, { key: 'value' });
resource = resourceClass.delete({ key: 'value' }, { key: 'value' }, function () {
});
resource = resourceClass.delete({ key: 'value' }, { key: 'value' }, function () {
}, function () {
});

resource = resourceClass.get();
resource = resourceClass.get({ key: 'value' });
resource = resourceClass.get({ key: 'value' }, function () {
});
resource = resourceClass.get(function () {
});
resource = resourceClass.get(function () {
}, function () {
});
resource = resourceClass.get({ key: 'value' }, { key: 'value' });
resource = resourceClass.get({ key: 'value' }, { key: 'value' }, function () {
});
resource = resourceClass.get({ key: 'value' }, { key: 'value' }, function () {
}, function () {
});

resourceArray = resourceClass.query();
resourceArray = resourceClass.query({ key: 'value' });
resourceArray = resourceClass.query({ key: 'value' }, function () {
});
resourceArray = resourceClass.query(function () {
});
resourceArray = resourceClass.query(function () {
}, function () {
});
resourceArray = resourceClass.query({ key: 'value' }, { key: 'value' });
resourceArray = resourceClass.query({ key: 'value' }, { key: 'value' }, function () {
});
resourceArray = resourceClass.query({ key: 'value' }, { key: 'value' }, function () {
}, function () {
});

resource = resourceClass.remove();
resource = resourceClass.remove({ key: 'value' });
resource = resourceClass.remove({ key: 'value' }, function () {
});
resource = resourceClass.remove(function () {
});
resource = resourceClass.remove(function () {
}, function () {
});
resource = resourceClass.remove({ key: 'value' }, { key: 'value' });
resource = resourceClass.remove({ key: 'value' }, { key: 'value' }, function () {
});
resource = resourceClass.remove({ key: 'value' }, { key: 'value' }, function () {
}, function () {
});

resource = resourceClass.save();
resource = resourceClass.save({ key: 'value' });
resource = resourceClass.save({ key: 'value' }, function () {
});
resource = resourceClass.save(function () {
});
resource = resourceClass.save(function () {
}, function () {
});
resource = resourceClass.save({ key: 'value' }, { key: 'value' });
resource = resourceClass.save({ key: 'value' }, { key: 'value' }, function () {
});
resource = resourceClass.save({ key: 'value' }, { key: 'value' }, function () {
}, function () {
});

var resourceService;
resourceClass = resourceService('test');
resourceClass = resourceService('test');
resourceClass = resourceService('test');

var mod;
var resourceServiceFactoryFunction;
var resourceService;

resourceClass = resourceServiceFactoryFunction(resourceService);

resourceServiceFactoryFunction = function (resourceService) {
    return resourceClass;
};
mod = mod.factory('factory name', resourceServiceFactoryFunction);
