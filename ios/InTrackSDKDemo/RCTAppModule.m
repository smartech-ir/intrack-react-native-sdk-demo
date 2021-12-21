#import "RCTAppModule.h"

@implementation RCTAppModule

RCT_EXPORT_MODULE(AppModule);

-(NSArray<NSString *> *)supportedEvents {
    return @[
      @"pushTokenAvailable",
      @"pushTokenFailed",
      @"notificationClicked",
      @"notificationRecieved"
    ];
}

- (instancetype)init {
    self = [super init];
    for (NSString *event in [self supportedEvents]) {
        [self addListener:event];
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}


+ (void)sendEvent:(NSString *)event body:(NSDictionary *)body {
    [[NSNotificationCenter defaultCenter] postNotificationName:event
                                                        object:self
                                                      userInfo:body];
}

# pragma mark private

- (void)startObserving {
    for (NSString *event in [self supportedEvents]) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(handleNotification:)
                                                     name:event
                                                   object:nil];
    }
}

- (void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)handleNotification:(NSNotification *)notification {
    [self sendEventWithName:notification.name body:notification.userInfo];
}

- (NSDictionary *)constantsToExport
{
  return @{ @"PUSH_CHANNEL": @"not_needed_in_ios" };
}

+ (NSString *) toJSON: (NSDictionary  *) json{
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:json options:NSJSONWritingPrettyPrinted error:&error];

    if (! jsonData) {
        return [NSString stringWithFormat:@"{'error': '%@'}", error];
    } else {
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        return jsonString;
    }
}



@end
