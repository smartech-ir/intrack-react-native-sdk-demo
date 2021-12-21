#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCTAppModule : RCTEventEmitter <RCTBridgeModule>
+ (void)sendEvent:(NSString *)event body:(NSDictionary *)body;
@end
