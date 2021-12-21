import React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {AppContextProvider} from './src/libs/context';
import {name as appName} from './app.json';
// import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue.js';
// const spyFunction = msg => {
//   console.log(msg);
// };

// MessageQueue.spy(spyFunction);

const AppWrapper = () => (
  <AppContextProvider>
    <App />
  </AppContextProvider>
);

AppRegistry.registerComponent(appName, () => AppWrapper);
