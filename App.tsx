// import React, { useState, useEffect } from 'react';
// import { SafeAreaView, Button, Text } from 'react-native';
// import { NativeModules } from 'react-native';
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
//
// const { GNSSModule } = NativeModules;
//
// const App = () => {
//   const [location, setLocation] = useState(null);
//   const [error, setError] = useState(null);
//   const [status, setStatus] = useState(null);
//   const [measurementStatus, setMeasurementStatus] = useState(null);
//   const [navigationMessageStatus, setNavigationMessageStatus] = useState(null);
//
//   useEffect(() => {
//     requestLocationPermission();
//   }, []);
//
//   const requestLocationPermission = async () => {
//     const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
//     if (result !== RESULTS.GRANTED) {
//       setError('Location permission denied');
//     } else {
//       setError(null);
//     }
//   };
//
//   const getLocation = () => {
//     if (!GNSSModule) {
//       setError('GNSSModule is not linked correctly');
//       return;
//     }
//
//     GNSSModule.getCurrentLocation()
//       .then((location) => {
//         console.log('location', location);
//         setLocation(location);
//         setError(null);
//       })
//       .catch((errorMsg) => {
//         setError(errorMsg);
//         setLocation(null);
//       });
//   };
//
//   const startGnssStatusUpdates = () => {
//     GNSSModule.startGnssStatusUpdates()
//       .then((message) =>
//       {
//         setStatus(message)
//       })
//       .catch((errorMsg) =>
//         setError(errorMsg));
//   };
//
//   const stopGnssStatusUpdates = () => {
//     GNSSModule.stopGnssStatusUpdates()
//       .then((message) => setStatus(message))
//       .catch((errorMsg) => setError(errorMsg));
//   };
//
//   const startGnssMeasurementsUpdates = () => {
//     GNSSModule.startGnssMeasurementsUpdates()
//       .then((message) => setMeasurementStatus(message))
//       .catch((errorMsg) => setError(errorMsg));
//   };
//
//   const stopGnssMeasurementsUpdates = () => {
//     GNSSModule.stopGnssMeasurementsUpdates()
//       .then((message) => setMeasurementStatus(message))
//       .catch((errorMsg) => setError(errorMsg));
//   };
//
//   const startGnssNavigationMessageUpdates = () => {
//     GNSSModule.startGnssNavigationMessageUpdates()
//       .then((message) => setNavigationMessageStatus(message))
//       .catch((errorMsg) => setError(errorMsg));
//   };
//
//   const stopGnssNavigationMessageUpdates = () => {
//     GNSSModule.stopGnssNavigationMessageUpdates()
//       .then((message) => setNavigationMessageStatus(message))
//       .catch((errorMsg) => setError(errorMsg));
//   };
//
//   return (
//     <SafeAreaView>
//       <Button title="Get Location" onPress={getLocation} />
//       {location && (
//         <Text>Latitude: {location.latitude}, Longitude: {location.longitude}</Text>
//       )}
//       {error && <Text>Error: {error}</Text>}
//       {status && <Text>Status: {status}</Text>}
//       {measurementStatus && <Text>Measurement Status: {measurementStatus}</Text>}
//       {navigationMessageStatus && <Text>Navigation Message Status: {navigationMessageStatus}</Text>}
//
//       <Button title="Start GNSS Status Updates" onPress={startGnssStatusUpdates} />
//       <Button title="Stop GNSS Status Updates" onPress={stopGnssStatusUpdates} />
//       <Button title="Start GNSS Measurements Updates" onPress={startGnssMeasurementsUpdates} />
//       <Button title="Stop GNSS Measurements Updates" onPress={stopGnssMeasurementsUpdates} />
//       <Button title="Start GNSS Navigation Message Updates" onPress={startGnssNavigationMessageUpdates} />
//       <Button title="Stop GNSS Navigation Message Updates" onPress={stopGnssNavigationMessageUpdates} />
//     </SafeAreaView>
//   );
// };
//
// export default App;

// import React, { useEffect, useState } from 'react';
// import { SafeAreaView, Button, Text, NativeModules, NativeEventEmitter, Platform, PermissionsAndroid, LogBox } from 'react-native';
//
// const { LocationModule } = NativeModules;
// const locationEventEmitter = new NativeEventEmitter(LocationModule);
//
// const App = () => {
//   const [location, setLocation] = useState(null);
//
//   useEffect(() => {
//     const requestLocationPermission = async () => {
//       if (Platform.OS === 'android') {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             {
//               title: 'Location Permission',
//               message: 'This app needs access to your location.',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             }
//           );
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             console.log('You can use the location');
//           } else {
//             console.log('Location permission denied');
//           }
//         } catch (err) {
//           console.warn(err);
//         }
//       }
//     };
//
//     if (Platform.OS === 'android') {
//       requestLocationPermission();
//     }
//
//     const locationSubscription = locationEventEmitter.addListener('onLocationChanged', (data) => {
//       console.log('Location changed:', data);
//       setLocation(data);
//     });
//
//     return () => {
//       locationSubscription.remove();
//     };
//   }, []);
//
//   const startLocationUpdates = () => {
//     LocationModule.startLocationUpdates();
//   };
//
//   const stopLocationUpdates = () => {
//     LocationModule.stopLocationUpdates();
//   };
//
//   return (
//     <SafeAreaView>
//       <Button title="Start Location Updates" onPress={startLocationUpdates} />
//       <Button title="Stop Location Updates" onPress={stopLocationUpdates} />
//       {location && (
//         <Text>
//           Location: Latitude {location.latitude}, Longitude {location.longitude}
//         </Text>
//       )}
//     </SafeAreaView>
//   );
// };
//
// export default App;


import React, { useEffect, useState } from 'react';
import { SafeAreaView, Button, Text, NativeModules, NativeEventEmitter, Platform, PermissionsAndroid, LogBox } from 'react-native';

const { LocationModule } = NativeModules;
const locationEventEmitter = new NativeEventEmitter(LocationModule);

const App = () => {
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
      console.log('Location changed:', data);
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

  return (
    <SafeAreaView>
      <Button title="Start Location Updates" onPress={startLocationUpdates} />
      <Button title="Stop Location Updates" onPress={stopLocationUpdates} />
      {location && (
        <Text>
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

export default App;
