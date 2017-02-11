var app = angular.module('rocksvashiModules', ['ngResource']);

app.directive('onLastItem', function($timeout, RequestQueue) {
	  return function(scope, element, attrs) {
		    if (scope.$last){
		    	$timeout(function() {
			    	scope.$eval(attrs.onLastItem)
		    	}, 200);
		    }
		  };
});

app.controller('MainCtrl', function($q, $scope, RequestQueue, $RestService, $timeout) {
    $scope.name = 'Testing Queue';
    $scope.results = [];
    $scope.posts = [];
    
    $scope.posts1 = [];
    $scope.count = 0;
    
    $scope.callback = function() {
    	 $timeout(function() {
         	$scope.hide = true}, 
         	200);
    };
    
    $scope.getData = function() {
    	return $RestService('https://jsonplaceholder.typicode.com/photos', null, true).list();
    }
    
    
    $scope.getData1 = function() {
    	
    	return  $RestService('https://jsonplaceholder.typicode.com/posts', null, true).list();
    }
    
    $scope.promise1 = function(p) {
    	p.then(function(result) {
    		console.log(result)
    		$scope.photos(result);
    	});
    }

    $scope.promise3 = function(p) {
    	p.then(function(result) {
    		$scope.posts1 = result;
    	});
}
    
    // nested call where parent call inside queue
    $scope.photos = function(items) {
    	$scope.posts = items;
    	//temp sleep method
    	// var start = new Date().getTime();
        // while (new Date().getTime() < start + 5000);
    	// we can further use queue to process nested calls or simple restapi call
    	/*RequestQueue.enqueue( 
    	$RestService('https://jsonplaceholder.typicode.com/photos/'+items[90].id).resource(), null, "Nested").process().then(function(result) {
            $scope.results.push(result[0].id);
        });
        */
    }
    
    $scope.start = function() {
    	RequestQueue.enqueue([
                $scope.getData(),
                $scope.getData1(),
            ],
            $scope.callback, "Outer").processAndMap([ $scope.promise1, $scope.promise3]);
    };
    
});
