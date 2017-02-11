## Angular Promise Queue
Useful for Queuing up all the Remote back end(XHR) calls and cloak with a loader gif and wait until all the requests are complete.


## Install
<script src="service.requestqueue.js" ></script>

## Usage
For any complex page which requires lots of parallel calls to fetch data and display on the UI, Its sometime difficult to display the data as an atomic operation, i.e
all XHR request are not sequential and response will be rendered as and when its received by thge browser client, This leads to 
flickering of the data on the UI. To avoid that, we can use this API to queue all the remote(XHR) request into a queue and display a loader image
on the view and hide it when all the calls are done. This will help in displaying the data on the view as single atomic operation.

```js
	// Example 1
	// Queue up all the calls and process when everything is done
	// with this approach, all response will be rendered once everything is completed i.e queue is empty.
	RequestQueue.enqueue([
        		vm.getFirstObject(4),
                vm.getSecondObject(5),
               	vm.getThirdObject({key:111})
            ],
            $scope.handlePageLoader).process().then(function(result) {
                // response will be returned in call seq
	            $scope.first.push(result[0].id);
	            $scope.second = result[1];
	            $scope.third.push(result[2].id);
        });

	 // Example 2
	// Queue up all the calls and keep processing(rendering) the response as and when response is ready on the view.
	// This is possible via passing the mapper functions i.e response handlers for each remote call.
	RequestQueue.enqueue([
                $scope.getFirstObject(),
                $scope.getSecondObject(),
            ],
            $scope.handlePageLoader, "QueueName").processAndMap([ $scope.responseHandlerFirstObject, $scope.responseHandlerSecondObject]);

```

## API

### RequestQueue([arrayOfRemoteCallFunctions], callback, queueKey )

Init the Request Queue

#### callback

Type: 'Function'

To hide the loader when queue is done.

##### queueKey

Type: `String`<br>
A name for the queue.

## Created by
- [RakeshV](https://github.com/rocksvashi)


## License
GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
