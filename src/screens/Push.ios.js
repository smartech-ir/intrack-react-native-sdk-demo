import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  Button,
  VStack,
  Divider,
  TextArea,
  useToast,
  FormControl,
} from 'native-base';
import InTrack from 'intrack-react-native-bridge';

import {AppContext} from '../libs/context';

export default function PushScreen() {
  const [token, setToken] = useState();
  const context = useContext(AppContext);
  const toast = useToast();

  useEffect(() => {
    if (context.state.token) {
      setToken(context.state.token);

      //infact you don't need to send token to InTrack Server in iOS, because InTrack SDK will do this automatically.
      //however for compatibility with android codes, you could keep it here.
      if (!context.state.token.includes('failed to get device token!')) {
        InTrack.onTokenRefresh(context.state.token);
      }
    }
  }, [context.state.token]);

  const initPush = async () => {
    //initialzie InTrack Push notification service
    InTrack.initNotificationService({
      askForUserPermission: true, // the default value is false, you can set it to true to get user permissions here.
    });

    toast.show({
      description: 'push notification service initialized',
    });
  };

  const sendEvent = () => {
    InTrack.sendEvent({eventName: 'event push trigger'});
    toast.show({
      description: '"event push trigger" sent',
    });
  };

  return (
    <ScrollView>
      <VStack space={4} alignItems="stretch" p={4}>
        <Button onPress={initPush}>Init Push Notification Service</Button>
        <FormControl>
          <FormControl.Label>Push Token:</FormControl.Label>
          <TextArea
            h={40}
            size="lg"
            placeholder="Push Token will be shown here..."
            value={token}
            isDisabled={true}
          />
        </FormControl>

        <Divider my="2" />

        <Button onPress={sendEvent}>Send an event</Button>
      </VStack>
    </ScrollView>
  );
}
