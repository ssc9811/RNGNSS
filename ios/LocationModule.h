#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <CoreLocation/CoreLocation.h>

@interface LocationModule : RCTEventEmitter <RCTBridgeModule, CLLocationManagerDelegate>
@end
