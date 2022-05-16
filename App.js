/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
var Sound = require('react-native-sound');
Sound.setCategory('Playback');
import metal from './Numb.mp3';
import {clearWarnings} from 'react-native/Libraries/LogBox/Data/LogBoxData';
import {useFocusEffect} from '@react-navigation/native';

console.log('playSound Called');
var metalSound = new Sound(metal, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // if loaded successfully
  console.log('Load sound success');
  //console.log('duration in seconds: ' + metalSound.getDuration() + 'number of channels: ' + metalSound.getNumberOfChannels());
});

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    metalSound.setVolume(1);
    return () => {
      metalSound.release();
    };
  }, []);
  const playPause = () => {
    metalSound.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading1}>MetalTooth</Text>
      <SafeAreaView style={styles.buttons}>
        <Button
          title="Connect to BlueTooth Device"
          onPress={() => {
            //TODO: connect to local speakers
          }}
        />
        <Button title="Connect with Nearby Users" />
        <Button
          style={styles.playMusicButton}
          title="GO METAL"
          onPress={playPause}
        />
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  playMusicButton: {
    title: 'bold', //TODO: this is NOT WORKING, FIX
  },
  buttons: {
    marginTop: 30,
  },
  heading1: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    paddingHorizontal: 24,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
