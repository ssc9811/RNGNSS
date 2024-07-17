#import "LocationModule.h"
#import <React/RCTLog.h>

@interface LocationModule ()
@property (nonatomic, strong) CLLocationManager *locationManager;
@end

@implementation LocationModule

RCT_EXPORT_MODULE();

// 초기화 메서드에서 CLLocationManager 설정
- (instancetype)init {
  self = [super init];
  if (self) {
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
  }
  return self;
}

// 지원되는 이벤트 이름을 반환
- (NSArray<NSString *> *)supportedEvents {
  return @[@"onLocationChanged"];
}

// 위치 업데이트 시작
RCT_EXPORT_METHOD(startLocationUpdates) {
  RCTLogInfo(@"startLocationUpdates called");
  [self.locationManager requestWhenInUseAuthorization];
  [self.locationManager startUpdatingLocation];
  RCTLogInfo(@"Started updating location");
}

// 위치 업데이트 중지
RCT_EXPORT_METHOD(stopLocationUpdates) {
  [self.locationManager stopUpdatingLocation];
  RCTLogInfo(@"Stopped updating location");
}

// 위치 업데이트 시 호출
- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations {
  CLLocation *location = [locations lastObject];
  RCTLogInfo(@"Location updated: %@", location);
  if (location != nil) {
    NSDictionary *locationData = @{
      @"latitude": @(location.coordinate.latitude),
      @"longitude": @(location.coordinate.longitude),
      @"altitude": @(location.altitude),
      @"accuracy": @(location.horizontalAccuracy),
      @"timestamp": @([location.timestamp timeIntervalSince1970]),
      @"description": location.description
    };
    [self sendEventWithName:@"onLocationChanged" body:locationData];
  }
}

// 위치 업데이트 실패 시 호출
- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
  RCTLogError(@"Failed to get location: %@", error);
}

@end
