import React, {useState} from 'react';
import {
  ScrollView,
  Button,
  VStack,
  Divider,
  Input,
  TextArea,
  useToast,
} from 'native-base';
import InTrack from 'intrack-react-native-bridge';

export default function EventsScreen() {
  const [eventName, setEventName] = useState('custom_event');
  const [eventDetails, setEventDetails] = useState(`{
      "key1": 123,
      "key2": "val2"
    }`);
  const toast = useToast();

  const sendEimpleEvent = () => {
    InTrack.sendEvent({eventName: 'simple_event'});
    toast.show({
      description: '"simple event" sent',
    });
  };
  const sendDetailedEvent = () => {
    InTrack.sendEvent({
      eventName: 'detailed_event',
      eventData: {
        numerical_field: 123,
        string_field: 'string',
        array_field: [1, 2, 3],
        object_field: {key1: 'value1', key2: 'value2'},
      },
    });

    toast.show({
      description: '"detailed event" sent',
    });
  };
  const sendCustomEvent = () => {
    let eventData = null;
    try {
      if (eventDetails) {
        eventData = JSON.parse(eventDetails);
      }
    } catch (error) {
      toast.show({
        description: 'event details is not valid JSON',
      });
    }

    InTrack.sendEvent({eventName, eventData});

    toast.show({
      description: '"custom_event" sent',
    });
  };

  return (
    <ScrollView>
      <VStack space={4} alignItems="stretch" p={4}>
        <Button onPress={sendEimpleEvent}>Send Simple Event</Button>
        <Button onPress={sendDetailedEvent}>Send Detailed Event</Button>
        <Divider my="2" />
        <Input
          size="lg"
          placeholder="Event Name"
          value={eventName}
          onChangeText={text => {
            setEventName(text);
          }}
        />
        <TextArea
          h={20}
          size="lg"
          placeholder="Event Details"
          value={eventDetails}
          onChangeText={text => {
            setEventDetails(text);
          }}
        />
        <Button onPress={sendCustomEvent}>Send Custom Event</Button>
      </VStack>
    </ScrollView>
  );
}
