# publisher
micro library to subscribe and emit a custom event

## Examples

### Basic example

```javascript
// create a function to triggered when event emit
const subscriber = function (data) {
    console.log(data);
};

// add subscriber to listen event with name EVENT_1
const firstSubscriber = publisher.subscribe('EVENT_1', subscriber);

// emit event to all subscriber to EVENT_1
publisher.emit('EVENT_1', 'hello subscriber');

// Deregister event
firstSubscriber();
```