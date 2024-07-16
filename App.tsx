import React, { useState, useEffect } from 'react';
import { SafeAreaView, Button, Text } from 'react-native';
import { NativeModules } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { GNSSModule } = NativeModules;

const App = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [measurementStatus, setMeasurementStatus] = useState(null);
  const [navigationMessageStatus, setNavigationMessageStatus] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result !== RESULTS.GRANTED) {
      setError('Location permission denied');
    } else {
      setError(null);
    }
  };

  const getLocation = () => {
    if (!GNSSModule) {
      setError('GNSSModule is not linked correctly');
      return;
    }

    GNSSModule.getCurrentLocation()
      .then((location) => {
        setLocation(location);
        setError(null);
      })
      .catch((errorMsg) => {
        setError(errorMsg);
        setLocation(null);
      });
  };

  const startGnssStatusUpdates = () => {
    GNSSModule.startGnssStatusUpdates()
      .then((message) => setStatus(message))
      .catch((errorMsg) => setError(errorMsg));
  };

  const stopGnssStatusUpdates = () => {
    GNSSModule.stopGnssStatusUpdates()
      .then((message) => setStatus(message))
      .catch((errorMsg) => setError(errorMsg));
  };

  const startGnssMeasurementsUpdates = () => {
    GNSSModule.startGnssMeasurementsUpdates()
      .then((message) => setMeasurementStatus(message))
      .catch((errorMsg) => setError(errorMsg));
  };

  const stopGnssMeasurementsUpdates = () => {
    GNSSModule.stopGnssMeasurementsUpdates()
      .then((message) => setMeasurementStatus(message))
      .catch((errorMsg) => setError(errorMsg));
  };

  const startGnssNavigationMessageUpdates = () => {
    GNSSModule.startGnssNavigationMessageUpdates()
      .then((message) => setNavigationMessageStatus(message))
      .catch((errorMsg) => setError(errorMsg));
  };

  const stopGnssNavigationMessageUpdates = () => {
    GNSSModule.stopGnssNavigationMessageUpdates()
      .then((message) => setNavigationMessageStatus(message))
      .catch((errorMsg) => setError(errorMsg));
  };

  return (
    <SafeAreaView>
      <Button title="Get Location" onPress={getLocation} />
      {location && (
        <Text>Latitude: {location.latitude}, Longitude: {location.longitude}</Text>
      )}
      {error && <Text>Error: {error}</Text>}
      {status && <Text>Status: {status}</Text>}
      {measurementStatus && <Text>Measurement Status: {measurementStatus}</Text>}
      {navigationMessageStatus && <Text>Navigation Message Status: {navigationMessageStatus}</Text>}

      <Button title="Start GNSS Status Updates" onPress={startGnssStatusUpdates} />
      <Button title="Stop GNSS Status Updates" onPress={stopGnssStatusUpdates} />
      <Button title="Start GNSS Measurements Updates" onPress={startGnssMeasurementsUpdates} />
      <Button title="Stop GNSS Measurements Updates" onPress={stopGnssMeasurementsUpdates} />
      <Button title="Start GNSS Navigation Message Updates" onPress={startGnssNavigationMessageUpdates} />
      <Button title="Stop GNSS Navigation Message Updates" onPress={stopGnssNavigationMessageUpdates} />
    </SafeAreaView>
  );
};

export default App;
