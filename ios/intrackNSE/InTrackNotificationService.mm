#import "InTrackNotificationService.h"

#if DEBUG
#define INTRACK_EXT_LOG(fmt, ...) NSLog([@"%@ " stringByAppendingString:fmt], @"[InTrackNSE]", ##__VA_ARGS__)
#else
#define INTRACK_EXT_LOG(...)
#endif

NSString* const kInTrackActionIdentifier = @"InTrackActionIdentifier";
NSString* const kInTrackCategoryIdentifier = @"InTrackCategoryIdentifier";

NSString* const kInTrackPNKeyInTrackPayload      = @"c";
NSString* const kInTrackPNKeyNotificationID      = @"id";
NSString* const kInTrackPNKeyButtons             = @"buttons";
NSString* const kInTrackPNKeyDefaultURL          = @"link";
NSString* const kInTrackPNKeyAttachment          = @"media";
NSString* const kInTrackPNKeyActionButtonIndex   = @"b";
NSString* const kInTrackPNKeyActionButtonTitle   = @"t";
NSString* const kInTrackPNKeyActionButtonURL     = @"l";
NSString* const kInTrackPNEventKeyNotificationID = @"i";

@implementation InTrackNotificationService
#if (TARGET_OS_IOS)
+ (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent *))contentHandler
{
    INTRACK_EXT_LOG(@"didReceiveNotificationRequest:withContentHandler:");

    NSDictionary* intrackPayload = request.content.userInfo[kInTrackPNKeyInTrackPayload];
    NSString* notificationID = intrackPayload[kInTrackPNKeyNotificationID];

    if (!notificationID)
    {
        INTRACK_EXT_LOG(@"InTrack payload not found in notification dictionary!");

        contentHandler(request.content);
        return;
    }

    INTRACK_EXT_LOG(@"Checking for notification modifiers...");
    UNMutableNotificationContent* bestAttemptContent = request.content.mutableCopy;

    NSArray* buttons = intrackPayload[kInTrackPNKeyButtons];
    if (buttons.count)
    {
        INTRACK_EXT_LOG(@"%d custom action buttons found.", (int)buttons.count);

        NSMutableArray* actions = [NSMutableArray new];

        [buttons enumerateObjectsUsingBlock:^(NSDictionary* button, NSUInteger idx, BOOL * stop)
        {
            NSString* actionIdentifier = [NSString stringWithFormat:@"%@%lu", kInTrackActionIdentifier, (unsigned long)idx + 1];
            UNNotificationAction* action = [UNNotificationAction actionWithIdentifier:actionIdentifier title:button[kInTrackPNKeyActionButtonTitle] options:UNNotificationActionOptionForeground];
            [actions addObject:action];
        }];

        NSString* categoryIdentifier = [kInTrackCategoryIdentifier stringByAppendingString:notificationID];

        UNNotificationCategory* category = [UNNotificationCategory categoryWithIdentifier:categoryIdentifier actions:actions intentIdentifiers:@[] options:UNNotificationCategoryOptionNone];

        [UNUserNotificationCenter.currentNotificationCenter setNotificationCategories:[NSSet setWithObject:category]];

        bestAttemptContent.categoryIdentifier = categoryIdentifier;

        INTRACK_EXT_LOG(@"%d custom action buttons added.", (int)buttons.count);
    }

    NSString* attachmentURL = intrackPayload[kInTrackPNKeyAttachment];
    if (!attachmentURL.length)
    {
        INTRACK_EXT_LOG(@"No attachment specified in InTrack payload.");
        INTRACK_EXT_LOG(@"Handling of notification finished.");

        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^
        {
            contentHandler(bestAttemptContent);
        });

        return;
    }

    INTRACK_EXT_LOG(@"Attachment specified in InTrack payload: %@", attachmentURL);

    [[NSURLSession.sharedSession downloadTaskWithURL:[NSURL URLWithString:attachmentURL] completionHandler:^(NSURL * location, NSURLResponse * response, NSError * error)
    {
        if (!error)
        {
            INTRACK_EXT_LOG(@"Attachment download completed!");

            NSString* attachmentFileName = [NSString stringWithFormat:@"%@-%@", notificationID, response.suggestedFilename ?: response.URL.absoluteString.lastPathComponent];

            NSString* tempPath = [NSTemporaryDirectory() stringByAppendingPathComponent:attachmentFileName];

            if (location && tempPath)
            {
                [NSFileManager.defaultManager moveItemAtPath:location.path toPath:tempPath error:nil];

                NSError* attachmentError = nil;
                UNNotificationAttachment* attachment = [UNNotificationAttachment attachmentWithIdentifier:attachmentFileName URL:[NSURL fileURLWithPath:tempPath] options:nil error:&attachmentError];

                if (attachment && !attachmentError)
                {
                    bestAttemptContent.attachments = @[attachment];

                    INTRACK_EXT_LOG(@"Attachment added to notification!");
                }
                else
                {
                    INTRACK_EXT_LOG(@"Attachment creation error: %@", attachmentError);
                }
            }
            else
            {
                INTRACK_EXT_LOG(@"Attachment `location` and/or `tempPath` is nil!");
            }
        }
        else
        {
            INTRACK_EXT_LOG(@"Attachment download error: %@", error);
        }

        INTRACK_EXT_LOG(@"Handling of notification finished.");
        contentHandler(bestAttemptContent);
    }] resume];
}
#endif
@end
