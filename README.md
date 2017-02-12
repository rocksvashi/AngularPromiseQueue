## Angular Resource Request Queue
An easy interface to queue all the XHR request on the page and display the response as an atomic operation.
<br />
This API also provides a support to perform any callback task after queue is done processing items i.e hiding loader gif etc.
</p>

#### Examples
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


## Integrating on the page
<script src="service.requestqueue.js" ></script>

## API

### RequestQueue([arrayOfRemoteCallFunctions], callback, queueKey)

Init the Request Queue

#### callback

Type: 'Function'

To hide the loader when queue is done.

##### queueKey
Type: `String`<br>
A name for the queue.

#### After Queue is initiated, Chain the process methods i.e
```js
RequestQueue([arrayOfRemoteCallFunctions], callback, queueKey).process().then(promiseArray) {
 ...
}
```

<h3>Or</h3>
```js
RequestQueue([$scope.getFoo(), $scope.getBar()], callback, queueKey).processAndMap([$scope.fooHandler, $scope.barHandler ]);
```

## Created by
- [RocksVashi](https://github.com/rocksvashi)

###NOTE
This is a very initial version of this API, I am very much open for suggestions/improvements.

## License
GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
