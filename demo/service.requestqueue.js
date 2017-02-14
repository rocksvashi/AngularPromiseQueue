(function() {
  
  'use strict';

  app.factory('RequestQueue', function($q) {
    var queue = null;
    var promises = [];
    var success = [];
    var failed = [];

    var dequeue = function() {
        console.log("Processing queue " + service.key);
        var item = queue[0]; //pick the front element of the queue
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
                
                return;
            }

        }).catch(function(error) {
            console.log(error);
            failed.push(item);
            // instead of rejecting, Just sending an empty array
            // because if promise calls fails then it doesn't wait for other to finish.
            // and in our case we want all the calls to complete. 
            item.defer.resolve([]);
            queue.shift();

            if (queue.length == 0) {
                if (angular.isFunction(service.callback)) {
                    service.callback();
                }
                
                return;
            }

            dequeue();
        });

    };

    var dequeueAndMap = function(mappers) {
        var item = queue[0]; //pick the front element of the queue

        // execute the endpoint
        item.endpoint.$promise.then(function(data) {
            queue.shift(); //remove the first item from the array
            item.defer.resolve(data);
            // now execute the mapper function
            if (mappers.length > 0) {
                var promiseHandler = mappers.shift();
                promiseHandler(item.defer.promise);
            }
            success.push(item)
            // check queue length and keep dequeuing
            if (queue.length > 0) {
                dequeueAndMap(mappers);
            }

            if (queue.length == 0) {
                service.logMetrics();
                if (angular.isFunction(service.callback)) {
                    service.callback();
                }

                return;
            }

        }).catch(function(error) {
            console.log(error);
            failed.push(item);
            // instead of rejecting, Just sending an empty array
            // because if promise calls fails then it doesn't wait for other to finish.
            // and in our case we want all the calls to complete. 
            item.defer.resolve([]);
            var promiseHandler = mappers.shift();
            promiseHandler(item.defer.promise);

            queue.shift();
            if (queue.length == 0) {
                service.logMetrics();
                if (angular.isFunction(service.callback)) {
                    service.callback();
                }

                return;
            }

            dequeueAndMap(mappers);
        });
    };

    var service = {};
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
        console.log("Processing queue " + service.key);
        if (angular.isFunction(service.callback)) {
            service.callback();
        }
        if (queue.length > 0) {
            dequeueAndMap(mappers);
        }

        return service;
    };

    service.logMetrics = function() {
        console.log("Successful :" + success.length)
        console.log("Failed :" + failed.length)
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

    return service;

  });
})(); 