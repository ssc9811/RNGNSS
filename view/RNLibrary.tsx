import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export const RNLibrary = () => {

  const [position, setPosition] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    error: null,
    timestamp: null,
    mocked: null,
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentPosition();
          } else {
            setPosition((prevState) => ({
              ...prevState,
              error: 'Location permission denied',
            }));
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getCurrentPosition();
      }
    };
    let watchId = null;
    const getCurrentPosition = () => {
      Geolocation.watchPosition(
        (position) => {
          if(Platform.OS === 'ios') {
            console.log('position ios', position);
          } else {
            console.log('position android', position);
          }
          setPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            error: null,
            timestamp: position.timestamp,
            mocked: position.mocked,
          });
        },
        (error) => {
          setPosition((prevState) => ({
            ...prevState,
            error: error.message,
          }));
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 10000, // 10 seconds
          fastestInterval: 10000, // 5 seconds
          maximumAge: 0,
        }
      );
    };

    requestLocationPermission();

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Position</Text>
      {position.latitude && position.longitude ? (
        <View>
          <Text>Latitude: {position.latitude}</Text>
          <Text>Longitude: {position.longitude}</Text>
          <Text>Accuracy: {position.accuracy} meters</Text>
          <Text>Altitude: {position.altitude} meters</Text>
          <Text>Altitude Accuracy: {position.altitudeAccuracy} meters</Text>
          <Text>Heading: {position.heading}</Text>
          <Text>Speed: {position.speed} m/s</Text>
          <Text>Timestamp: {new Date(position.timestamp).toLocaleString()}</Text>
          <Text>Mocked: {position.mocked ? 'Yes' : 'No'}</Text>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
      {position.error && <Text>Error: {position.error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
