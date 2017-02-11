app.factory('$RestService', function($resource) {

    return function(url, obj, isArray) {

        var mapper = {
            list: {
                method: 'GET',
                isArray: isArray
            },
            resource: {
                'method': 'GET',
                cache: false,
            },
        };

        return $resource(url, null, mapper);
    };
});