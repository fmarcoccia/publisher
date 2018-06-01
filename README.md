# publisher
micro library to subscribe and emit a custom event

## Examples

### Basic example

```javascript
// add subscriber to listen event with name EVENT_1
const firstSubscriber = publisher.subscribe('EVENT_1', (data) => {
    console.log('recive data from EVENT_1 --> ', data)
});

// emit event to all subscriber to EVENT_1
publisher.emit('EVENT_1', 'hello subscriber');

// Deregister event
firstSubscriber();
```
