import React, {useEffect, useContext} from 'react';
import {DeviceEventEmitter} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider} from 'native-base';

import {AppContext} from './libs/context';
import HomeScreen from './screens/Home';
import EventScreen from './screens/Events';
import UsersScreen from './screens/Users';
import PushScreen from './screens/Push';

import InTrack from 'intrack-react-native-bridge';

const Stack = createNativeStackNavigator();

const App = () => {
  const context = useContext(AppContext);

  useEffect(() => {
    // initialize InTrack
    async function initItrack() {
      try {
        if (!(await InTrack.isInitialized())) {
          const options = {
            appKey: 'APP_KEY',
            iosAuthKey: 'IOS_AUTH_KEY',
            androidAuthKey: 'ANDROID_AUTH_KEY',
          };

          await InTrack.init(options);
        }
        InTrack.start();
      } catch (error) {
        console.log(error);
      }
    }
    initItrack();

    InTrack.onNotificationClicked(event => {
      console.log('push notification clicked:', event);
    });

    // these events are sent from native code, see the following files for implementation details
    // - android/app/src/main/java/com/intracksdkdemo/MainActivity.java (for Android)
    // - ios/InTrackSDKDemo/AppDelegate.m (for iOS)

    // if you don't want to mess with native codes, you can use a package for this reason, like:
    // https://github.com/wix/react-native-notifications
    DeviceEventEmitter.addListener('pushTokenAvailable', token => {
      console.log('PUSH TOKEN', token);
      context.dispatch({type: 'TOKEN_AVAILABLE', payload: token});
    });

    DeviceEventEmitter.addListener('pushTokenFailed', () => {
      context.dispatch({
        type: 'TOKEN_AVAILABLE',
        payload: 'failed to get device token!',
      });
    });

    //this is the same as InTrack.onNotificationClicked (but it is just work if app is in foreground)
    DeviceEventEmitter.addListener('notificationClicked', event => {
      console.log('notificationClicked', event);
    });
    DeviceEventEmitter.addListener('notificationRecieved', event => {
      console.log('notificationRecieved', event);
    });
  });

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'InTrack'}}
          />
          <Stack.Screen name="Events" component={EventScreen} />
          <Stack.Screen name="Users" component={UsersScreen} />
          <Stack.Screen name="Push" component={PushScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
