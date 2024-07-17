import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Button,
  Text,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  LogBox,
  StyleSheet
} from "react-native";

const { LocationModule } = NativeModules;
const locationEventEmitter = new NativeEventEmitter(LocationModule);

export const IOSNative = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    if (Platform.OS === 'android') {
      requestLocationPermission();
    }

    const locationSubscription = locationEventEmitter.addListener('onLocationChanged', (data) => {
      console.log('IOS Location changed:', data);
      setLocation(data);
    });

    return () => {
      locationSubscription.remove();
    };
  }, []);

  const startLocationUpdates = () => {
    LocationModule.startLocationUpdates();
  };

  const stopLocationUpdates = () => {
    LocationModule.stopLocationUpdates();
  };

  console.log('ios', location);

  return (
    <SafeAreaView>
      <Button title="Start Location Updates" onPress={startLocationUpdates} />
      <Button title="Stop Location Updates" onPress={stopLocationUpdates} />
      {location && (
        <Text style={styles.text}>
          Location: Latitude {location.latitude}, Longitude {location.longitude}{'\n'}
          Altitude: {location.altitude}{'\n'}
          Accuracy: {location.accuracy}{'\n'}
          Timestamp: {new Date(location.timestamp * 1000).toLocaleString()}{'\n'}
          Description: {location.description}
        </Text>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
});
