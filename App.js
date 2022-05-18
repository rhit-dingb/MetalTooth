/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, Component} from 'react';
import {NetworkInfo} from 'react-native-network-info';
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
  TextInput,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import TrackPlayer from 'react-native-track-player';

//------TCP SOCKET
const {init, server, client} = require('./tcp');

const options = {
  port: 12345,
  host: 'ipAddress',
  reuseAddress: true,
};

// Get Local IP
// NetworkInfo.getIPAddress().then(ipAddress => {
//   console.log(ipAddress);
//   options = {
//     port: 12345,
//     host: ipAddress,
//     reuseAddress: true,
//   };
// });

// Get IPv4 IP (priority: WiFi first, cellular second)
// NetworkInfo.getIPV4Address().then(ipv4Address => {
//   console.log(ipv4Address);
//   options = {
//     port: 12345,
//     host: ipv4Address,
//     reuseAddress: true,
//   };
// });

// Create socket
// const client = () => {
//   TcpSocket.createConnection(options, () => {
//     // Write on the socket
//     console.log('client opened on ' + JSON.stringify(client.address()));

//     // Close socket
//     //client.destroy();
//   });

//   client.on('data', function (data) {
//     console.log('message was received', data);
//   });

//   client.on('error', function (error) {
//     console.log(error);
//   });

//   client.on('close', function () {
//     console.log('Connection closed!');
//   });
// };

// const server = () => {
//   TcpSocket.createServer(function (socket) {
//     console.log('connected on ' + JSON.stringify(socket.address()));

//     socket.on('data', data => {
//       socket.write('Echo server ' + data);
//     });

//     socket.on('error', error => {
//       console.log('An error ocurred with client socket ', error);
//     });

//     socket.on('close', error => {
//       console.log('Closed connection with ', socket.address());
//     });
//   }).listen({port: 12345, host: '15.10.8.23'}, () => {
//     console.log('server opened on ' + JSON.stringify(server.address()));
//   });

//   server.on('error', error => {
//     console.log('An error ocurred with the server', error);
//   });

//   server.on('close', () => {
//     console.log('Server closed connection');
//   });
// };
//------TCP SOCKET

var Sound = require('react-native-sound');
Sound.setCategory('Playback');
import metal from './Numb.mp3';
import {clearWarnings} from 'react-native/Libraries/LogBox/Data/LogBoxData';
import {useFocusEffect} from '@react-navigation/native';
import MusicControl from 'react-native-music-control';
// Basic Controls
MusicControl.enableControl('play', true);
MusicControl.enableControl('pause', true);
MusicControl.enableControl('stop', false);
MusicControl.enableControl('nextTrack', true);
MusicControl.enableControl('previousTrack', false);

// Changing track position on lockscreen
MusicControl.enableControl('changePlaybackPosition', true);

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

const controlMusic = () => {
  console.log('now playing music throught music control');
  MusicControl.setNowPlaying({
    title: 'Numb',
    artwork:
      'https://upload.wikimedia.org/wikipedia/en/b/b9/Linkin_Park_-_Numb_CD_cover.jpg?20080119230823', // URL or RN's image require()
    artist: 'Linkin Park',
    album: 'Meteora',
    genre: 'Rock, Metal',
    duration: 186, // (Seconds)
    isLiveStream: false, // iOS Only (Boolean), Show or hide Live Indicator instead of seekbar on lock screen for live streams. Default value is false.
  });
};

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

// class TextIPBox extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {text: ''};
//   }

//   render() {
//     return (
//       <SafeAreaView>
//         <Text>Host Network IP: </Text>
//         <TextInput
//           style={styles.input}
//           onChangeText={text => this.setState({text})}
//           placeholder="192.168.2.0"
//           keyboardType="numeric"
//         />
//       </SafeAreaView>
//     );
//   }
// }
var hostIP = '';
var localIP = '';
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
  const controlMusicPlay = () => {
    console.log('play button pressed');
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PLAYING,
      elapsedTime: 135,
    });
  };
  const controlMusicPause = () => {
    console.log('pause button pressed');
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PAUSED,
      elapsedTime: 135,
    });
  };

  const controlMusicDebug = () => {};
  const controlMusicHost = () => {
    console.log('host button pressed');
    //console.log('host IP from TextBox is: ' + hostIP);
    //console.log(options.host);
    server.listen(
      {
        port: 12345,
        host: localIP,
        reuseAddress: true,
      },
      () => {
        console.log('server opened on ' + JSON.stringify(server.address()));
      },
    );
  };

  const controlMusicJoin = () => {
    console.log('join button pressed');
    client.connect(
      {
        port: 12345,
        host: hostIP,
        localAddress: localIP,
        reuseAddress: true,
      },
      () => {
        console.log('client on ' + JSON.stringify(client.address()));
      },
    );
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
        <Button
          style={styles.playMusicButton}
          title="GO METAL MUSIC CONTROL"
          onPress={controlMusic}
        />
        <Button
          style={styles.playMusicButton}
          title="Play"
          onPress={controlMusicPlay}
        />
        <Button
          style={styles.playMusicButton}
          title="Pause"
          onPress={controlMusicPause}
        />
        <Button
          style={styles.playMusicButton}
          title="SwithTo100Sec-DEBUG"
          onPress={controlMusicDebug}
        />
        <SafeAreaView>
          <Button
            style={styles.playMusicButton}
            title="Host Party"
            onPress={controlMusicHost}
          />
          <TextInput
            style={styles.input}
            onChangeText={text => (localIP = text)}
            placeholder="Local IP"
            keyboardType="numeric"
          />
        </SafeAreaView>

        <TextInput
          style={styles.input}
          onChangeText={text => (hostIP = text)}
          placeholder="Host IP"
          keyboardType="numeric"
        />

        <Button
          style={styles.playMusicButton}
          title="Join Party"
          onPress={controlMusicJoin}
        />
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 20,
  },
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
