app.service('RequestQueue', function($q, $timeout) {
    var queue = null;
    var promises = [];
    var success = [];
    var failed = [];
    
    var dequeue = function() {
    	console.log("Processing queue " + service.key);
        var item = queue[0];//pick the front element of the queue
        
        $timeout(function() {
            // execute the endpoint
        	item.endpoint.$promise.then(function(data) {
                queue.shift(); //remove the first item from the array
                item.defer.resolve(data);
                success.push(item)
                // check queue length and keep dequeuing
                if (queue.length > 0) {
                    dequeue();
                }
                
                if (queue.length == 0) {
                    if (angular.isFunction(service.callback)) {
                        service.callback();
                    }
                }
                
            }).catch(function(error) {
            	console.log(error);
            	failed.push(item);
            	// instead of rejecting, Just sending an empty array
            	// because if promise calls fails then it doesn't wait for other to finish.
            	// and in our case we want all the calls to complete. 
            	item.defer.resolve([]);
            	queue.shift();
            	dequeue();
            });

            // this is handled for a scenario when if any of the call fails
            if (queue.length == 1) {
                if (angular.isFunction(service.callback)) {
                    service.callback();
                }
            }
        }, 10);
    };

    var dequeueAndMap = function(mappers) {
    	console.log("Processing queue " + service.key);
        var item = queue[0];//pick the front element of the queue
        $timeout(function() {
            // execute the endpoint
        	item.endpoint.$promise.then(function(data) {
                queue.shift(); //remove the first item from the array
                item.defer.resolve(data);
                // now execute the mapper function
                if(mappers.length > 0 ){
                	var f =  mappers.shift();
                	f(item.defer.promise);
                }
                
                // check queue length and keep dequeuing
                if (queue.length > 0) {
                	 dequeueAndMap(mappers);
                }
                
                if (queue.length == 0) {
                    if (angular.isFunction(service.callback)) {
                        service.callback();
                    }
                }
                
            }).catch(function(error) {
            	console.log(error);
            	failed.push(item);
            	// instead of rejecting, Just sending an empty array
            	// because if promise calls fails then it doesn't wait for other to finish.
            	// and in our case we want all the calls to complete. 
            	item.defer.resolve([]);
            	 var f =  mappers.shift();
                 f(item.defer.promise);
                 
                 queue.shift();
                 dequeueAndMap(mappers);
            });

            // this is handled for a scenario when if any of the call fails
            if (queue.length == 1) {
                if (angular.isFunction(service.callback)) {
                    service.callback();
                }
            }
            
        }, 100);
    };

    
    var service = this;
    service.initCallback = false;
    service.callback = {}; // Takes a callback function in case if we want to perform some page logic after data is received.
    service.key = {}; // can be set to track current queue 
    service.process = function() {
        if (queue.length > 0) {
            dequeue();
            var t = promises; //copy the promises into temp array
            promises = []; //empty it
            return $q.all(t);
        }
    };
    
    service.processAndMap = function(mappers) {
        if (queue.length > 0) {
            dequeueAndMap(mappers);
        }
    };
    
    service.successCount = function () {
    	return success.length;
    }
    
    service.failureCount = function () {
    	return failed.length;
    }
    
    service.init = function() {
    	 queue = [];
    	 success = [];
    	 failed = [];
    	 promises = [];
    }
    
    //enqueue the request
    service.enqueue = function(endpoint, callback, key) {
        var defer = null;
        service.callback = callback;
        service.key = key;
        service.init();
        if (angular.isArray(endpoint)) {
            angular.forEach(endpoint, function(item) {
            	// lets create a task which will finish in the future.
                defer = $q.defer();
                queue.push({
                    endpoint: item,
                    defer: defer
                });
                promises.push(defer.promise);
            });
        } else {
            defer = $q.defer();
            queue.push({
                endpoint: endpoint,
                defer: defer
            });
            promises.push(defer.promise);
        }
        
        return service;
    };
});
