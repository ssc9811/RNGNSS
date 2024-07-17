import React, { useState } from "react";
import { Button, SafeAreaView, StyleSheet, View } from "react-native";
import { RNLibrary } from "./view/RNLibrary.tsx";
import { AndroidNative } from "./view/AndroidNative.tsx";
import { IOSNative } from "./view/IOSNative.tsx";

const App = () => {
  const [page, setPage] = useState('RN');
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Button title={'RN Library'} onPress={() => {setPage('RN')}}/>
        <Button title={'Android Native'} onPress={() => {setPage('Android')}}/>
        <Button title={'iOS Native'} onPress={() => {setPage('iOS')}}/>
      </View>
      <View>
        {page === 'RN' && <RNLibrary />}
        {page === 'Android' && <AndroidNative />}
        {page === 'iOS' && <IOSNative />}
      </View>
    </SafeAreaView>
  )
}

export default App;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
