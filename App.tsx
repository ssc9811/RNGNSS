import React, { useState } from 'react';
import { SafeAreaView, Button, Text } from 'react-native';
import { NativeModules } from 'react-native';

const { GNSSModule } = NativeModules;

const App = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (!GNSSModule) {
      setError('GNSSModule is not linked correctly');
      return;
    }

    GNSSModule.getCurrentLocation()
      .then((location) => {
        console.log('location',location);
        setLocation(location);
        setError(null);
      })
      .catch((errorMsg) => {
        console.log('errorMsg',errorMsg);
        setError(errorMsg);
        setLocation(null);
      });
  };

  return (
    <SafeAreaView>
      <Button title="Get Location" onPress={getLocation} />
      {location && (
        <Text>Latitude: {location.latitude}, Longitude: {location.longitude}</Text>
      )}
      {error && <Text>Error: {error}</Text>}
    </SafeAreaView>
  );
};

export default App;
