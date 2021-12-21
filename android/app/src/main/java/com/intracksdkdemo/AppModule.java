package com.intracksdkdemo;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.google.firebase.messaging.FirebaseMessaging;

import java.util.HashMap;
import java.util.Map;

public class AppModule extends ReactContextBaseJavaModule {
    AppModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "AppBridge";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("PUSH_CHANNEL", this.getCurrentActivity().getString(R.string.default_notification_channel_id));
        return constants;
    }

    @ReactMethod
    public void getFireBasePushToken(Promise promise) {
        //getting fcm token and send it to InTrack
        FirebaseMessaging.getInstance().getToken()
            .addOnCompleteListener(task -> {
                if (!task.isSuccessful()) {
                    promise.reject("error","getInstanceId failed");
                    return;
                }

                // Get new FCM registration token
                String token = task.getResult();
                promise.resolve(token);
            });
    }
}