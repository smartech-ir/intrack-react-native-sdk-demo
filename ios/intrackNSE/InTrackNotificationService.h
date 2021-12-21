#import <Foundation/Foundation.h>

#if (TARGET_OS_IOS)
#import <UserNotifications/UserNotifications.h>
#endif

NS_ASSUME_NONNULL_BEGIN

extern NSString* const kInTrackActionIdentifier;

extern NSString* const kInTrackPNKeyInTrackPayload;
extern NSString* const kInTrackPNKeyNotificationID;
extern NSString* const kInTrackPNKeyButtons;
extern NSString* const kInTrackPNKeyDefaultURL;
extern NSString* const kInTrackPNKeyAttachment;
extern NSString* const kInTrackPNKeyActionButtonIndex;
extern NSString* const kInTrackPNKeyActionButtonTitle;
extern NSString* const kInTrackPNKeyActionButtonURL;
extern NSString* const kInTrackPNEventKeyNotificationID;

@interface InTrackNotificationService : NSObject
#if (TARGET_OS_IOS)
+ (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent *))contentHandler API_AVAILABLE(ios(10.0));
#endif

NS_ASSUME_NONNULL_END

@end
