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
import {NativeModules} from 'react-native';
import InTrack from 'intrack-react-native-bridge';

import {AppContext} from '../libs/context';

// our demo helper bridge for communicating with native codes
// you could use this module if it is convinient for your project.
// also you might use some popular NPM module for this kind of stuff like :
// https://github.com/wix/react-native-notifications
const AppModule = NativeModules.AppBridge;
const {PUSH_CHANNEL} = AppModule.getConstants();

export default function PushScreen() {
  const [token, setToken] = useState();
  const context = useContext(AppContext);
  const toast = useToast();

  useEffect(() => {
    setToken(context.state.token);
    if (
      context.state?.token &&
      !context.state?.token?.includes('failed to get device token!')
    ) {
      InTrack.onTokenRefresh(context.state.token);
    }
  }, [context.state.token]);

  const initPush = async () => {
    try {
      //initialzie InTrack Push notification service
      InTrack.initNotificationService();

      // OPTIOANL: in android you can also get push token with the following method:
      // const pushToken = await AppModule.getFireBasePushToken();

      toast.show({
        description: 'push notification service initialized',
      });
    } catch (e) {
      toast.show({
        description: 'something went wrong!',
      });
      console.error(e);
    }
  };

  const displayLocalMessage = () => {
    InTrack.pushMessageReceived(
      {
        id: 'messageId01',
        title: 'Push Title',
        message: 'Push Message',
        media: 'https://docs.intrack.ir/img/logo.png',
        // sound: '',
        // link: 'https://smartech.ir',
        // buttons:
        // '[{"t":"inTrack","l":"https:\\/\\/intrack.ir"},{"t":"adverge","l":"https:\\/\\/adverge.ir"}]',
      },
      PUSH_CHANNEL,
    );
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

        <Button onPress={displayLocalMessage}>
          Display Sample Push (Local)
        </Button>

        <Button onPress={sendEvent}>Send an event</Button>
      </VStack>
    </ScrollView>
  );
}
