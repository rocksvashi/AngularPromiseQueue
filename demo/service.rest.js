app.factory('RestService', function($resource) {

    return function(url, obj, isArray) {

    	var mapper = {
            list: {
                method: 'GET',
                isArray: isArray
            }
        };

        return $resource(url, null, mapper);
    };
});