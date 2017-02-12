app.factory('RestService', function($resource) {

    return function(url, obj, isArray) {

    	var mappers = {
            list: {
                method: 'GET',
                isArray: isArray
            }
        };

        return $resource(url, null, mappers);
    };
});