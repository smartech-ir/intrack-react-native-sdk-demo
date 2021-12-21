# InTrack React Native SKD Demo

This is a demo project for representing InTrack SDK functionality.

## Initialize

first of all change `APP_KEY` , `IOS_AUTH_KEY` and `ANDROID_AUTH_KEY` in src/App.js file.

```
const options = {
    appKey: 'APP_KEY',
    iosAuthKey: 'IOS_AUTH_KEY',
    androidAuthKey: 'ANDROID_AUTH_KEY',
};
await InTrack.init(options);
```

if you just want to test on Android or iOS, you could use the init method in the following way:

```
await InTrack.init('APP_KEY', 'RELATED_AUTH_KEY');
```

## Push notification

this project is configured to register and get push notification from Firebase for Android, so for lunching the project,
you need to provide your Firebase Android config file (`google-services.json`).
you should place it in `./android/app` folder.

if you don't want to use push notification service, just remove 'com.google.gms.google-services' plugin in
the module (app-level) Gradle file (app/build.gradle)

```
apply plugin: 'com.google.gms.google-services'  // Google Services plugin (remove this line if you don't want to use firebase push notification)
```

for iOS you need to configure your APN account and provide your TEAM_ID for enabling Push Notifications Capability.

for further information please see our docs[https://docs.intrack.ir/]
