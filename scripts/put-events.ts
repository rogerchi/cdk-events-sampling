import * as AWS from 'aws-sdk';
import { PutEventsRequestEntryList } from 'aws-sdk/clients/cloudwatchevents';

const events = new AWS.EventBridge();
const NUMBER_OF_EVENTS = 10000;
const eventBusName = process.argv[2];

if (!eventBusName) {
  throw new Error('Please provide an event bus name as the argument');
}

let commands: PutEventsRequestEntryList = [];

for (let i = 0; i < NUMBER_OF_EVENTS; i++) {
  commands.push({
    DetailType: 'testEvent',
    Detail: JSON.stringify({ eventNumber: i }),
    EventBusName: eventBusName,
    Source: 'test',
  });
}

for (let i = 0; i < commands.length; i += 10) {
  events.putEvents({ Entries: commands.slice(i, i + 10) }, (err, data) => {
    if (err) {
      console.error(err, err.stack);
    } else {
      console.info(data);
    }
  });
}
