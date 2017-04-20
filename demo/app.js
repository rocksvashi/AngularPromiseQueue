var app = angular.module('rocksvashiModules', [ 'ngResource' ]);

// will track the last item on the ng repeat
// on-last-item="handlePageLoader();"
app.directive('onLastItem', function($timeout, RequestQueue) {
	return function(scope, element, attrs) {
		if (scope.$last) {
			$timeout(function() {
				scope.$eval(attrs.onLastItem)
			}, 200);
		}
	};
});

app.controller('MainCtrl', function($q, $scope, RequestQueue, RestService, $timeout) {
	$scope.name = 'Testing Queue';
	$scope.albums = [];
	$scope.todos = [];

	$scope.handlePageLoader = function() {
		$timeout(function() {
			$scope.hide = true
		},
		200);
	};
	
	// Fetches the {@code Album} list
	$scope.getAlbumData = function() {
		return RestService('https://jsonplaceholder.typicode.com/posts', null, true).list();
	}

	// Fetches the {@code Todo's} list
	$scope.getTodos = function() {
		return RestService('https://jsonplaceholder.typicode.com/todos', null, true).list();
	}

	// Handles the response for the Album list
	$scope.albumHandler = function(promise) {
		promise.then(function(response) {
			$scope.albums = response;
		});
	}

	// Handles the response for the Todo's list
	$scope.todosHandler = function(promise) {
		promise.then(function(response) {
			$scope.todos = response;
		});
	}

	$scope.start = function() {
		RequestQueue.enqueue([
			$scope.getAlbumData,
			$scope.getTodos,
		],
		$scope.handlePageLoader, "MainQueue").processAndMap([$scope.albumHandler, $scope.todosHandler ]);
	};

});