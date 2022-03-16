import React from 'react';
import {ScrollView, Button, VStack, Divider, useToast} from 'native-base';
import InTrack from 'intrack-react-native-bridge';

export default function CrashReportScreen() {
  const toast = useToast();

  const crash = () => {
    throw new Error('ooops!');
  };
  const handlededFatalException = () => {
    try {
      throw new Error('handeled exception!');
    } catch (error) {
      InTrack.logException(error, true);
    }

    toast.show({
      description: 'an event handeled and reported to inTrack',
    });
  };
  const handledNonFatalException = () => {
    InTrack.logException('SOME ERROR HAPPEND!', false);

    toast.show({
      description: 'an event handeled and reported to inTrack',
    });
  };

  return (
    <ScrollView>
      <VStack space={4} alignItems="stretch" p={4}>
        <Button onPress={crash}>CRASH!!!</Button>
        <Divider my="2" />
        <Button onPress={handlededFatalException}>
          Record Fatal Exception
        </Button>
        <Button onPress={handledNonFatalException}>
          Record non-Fatal Exception
        </Button>
      </VStack>
    </ScrollView>
  );
}
