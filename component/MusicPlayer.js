import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  Button,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TcpSocket from 'react-native-tcp-socket';
import songs from '../model/data';
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {clearWarnings} from 'react-native/Libraries/LogBox/Data/LogBoxData';

const {width, height} = Dimensions.get('window');

async function setupTrack() {
  await TrackPlayer.setupPlayer();
  //await TrackPlayer.add(songs);
  var track = {
    title: 'Numb',
    artist: 'Linken Park',
    artwork: require('../assets/artwork/numb.jpeg'),
    id: '1',
    url: require('../assets/music/Numb.mp3'),
    duration: 186,
  };
  await TrackPlayer.add(track);
  console.log(
    '!!!!!!!TrackPlayer is good to go!!!!!!!' + TrackPlayer.getCurrentTrack(),
  );
}

const togglePlayback = async playbackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  console.log('***Play Button Pressed***');
  if (currentTrack != null) {
    if (playbackState == State.Paused) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};
const sendMusicStatus = (progress, playbackState) => {
  //console.log('sending music status');
  var status = '';
  if (playbackState == State.Paused) {
    status = 'Play';
  } else {
    status = 'Stop';
  }
  if (socketList[0] != undefined)
    socketList[0].write(status + ' ' + progress.position);
};

var hostIP = '';
var localIP = '';
//setupTrack();

//------TCP SOCKET
const server = new TcpSocket.Server();
const client = new TcpSocket.Socket();
const socketList = [];

server.on('connection', socket => {
  console.log(
    'Client connected to server on ' + JSON.stringify(socket.address()),
  );
  socketList.push(socket);

  socket.on('data', data => {
    console.log(
      'Server client received: ' +
        (data.length < 500 ? data : data.length + ' bytes'),
    );
  });

  socket.on('error', error => {
    console.log('Server client error ' + error);
  });

  socket.on('close', error => {
    console.log('Server client closed ' + (error ? error : ''));
  });
});

server.on('error', error => {
  console.log('Server error ' + error);
});

server.on('close', () => {
  console.log('Server closed');
});

client.on('connect', () => {
  console.log('Opened client on ' + JSON.stringify(client.address()));
});

client.on('drain', () => {
  console.log('Client drained');
});

client.on('data', data => {
  console.log(
    'Client received: ' + (data.length < 500 ? data : data.length + ' bytes'),
    updateMusicStatus(data),
  );
});

client.on('error', error => {
  console.log('Client error ' + error);
});

client.on('close', error => {
  console.log('Client closed ' + (error ? error : ''));
});

// const options = {
//   port: 12345,
//   host: 'ipAddress',
//   reuseAddress: true,
// };

const MusicPlayer = () => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  useEffect(() => {
    setupTrack();
  });
  const renderSongs = (index, item) => {
    return (
      <View
        style={{
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.artworkWrapper}>
          <Image
            source={require('../assets/artwork/numb.jpeg')}
            style={styles.artworkImg}
          />
        </View>
      </View>
    );
  };

  const playPause = () => {
    metalSound.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  };

  const updateMusicStatus = async data => {
    const playStatusEvent = data.toString().substring(0, 4);
    const progressCheckEvent = Number(data.toString().substring(5));
    if (playbackState === State.Paused) {
      if (playStatusEvent === 'Play') {
        playbackState = State.Playing;
        return;
      }
    }
    if (playbackState === State.Playing) {
      if (playStatusEvent === 'Stop') {
        playbackState = State.Paused;
        return;
      }
    }
    if (Math.abs(progressCheckEvent - progress.position) < 0.05) {
      await TrackPlayer.seekTo(progressCheckEvent);
    }
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
    <View style={styles.mainContainer}>
      <View style={styles.tcpContainer1}>
        {/* <Button
          style={styles.playMusicButton}
          title="SwithTo100Sec-DEBUG"
          onPress={controlMusicDebug}
        /> */}
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
      </View>
      <View style={styles.tcpContainer}>
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
      </View>

      <FlatList
        data={songs}
        renderItem={renderSongs}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      />
      <Text style={styles.title}>Numb</Text>
      <Text style={styles.artist}>Linken Park</Text>
      <View>
        <Slider
          style={styles.progressContainer}
          value={progress.position}
          minimumValue={0}
          maximumValue={progress.duration}
          thumbTintColor="black"
          minimumTrackTintColor="black"
          onSlidingComplete={async value => {
            await TrackPlayer.seekTo(value);
          }}
        />
      </View>
      <View style={styles.progressLabelContainer}>
        <Text style={styles.progressLabelTxt}>
          {new Date(progress.position * 1000).toISOString().substr(14, 5)}
        </Text>
        <Text style={styles.progressLabelTxt}>
          {new Date((progress.duration - progress.position) * 1000)
            .toISOString()
            .substr(14, 5)}
        </Text>
      </View>

      <View style={styles.musicControlls}>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons
            name="play-skip-back-outline"
            size={35}
            color="black"
            style={{marginTop: 20}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            togglePlayback(playbackState);
            sendMusicStatus(progress, playbackState);
          }}>
          <Ionicons
            name={
              playbackState === State.Playing
                ? 'ios-pause-circle'
                : 'ios-play-circle'
            }
            size={75}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons
            name="play-skip-forward-outline"
            size={35}
            color="black"
            style={{marginTop: 20}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  progressLabelContainer: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelTxt: {
    color: 'black',
  },
  progressContainer: {
    flexDirection: 'row',
    width: 350,
    height: 40,
    marginTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  artist: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
  },
  musicControlls: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
    marginTop: 5,
    marginLeft: 65,
  },
  artworkWrapper: {
    width: 300,
    height: 340,
    marginBottom: 5,

    shadowColor: '#44535f',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  artworkImg: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkWrapper: {
    width: 300,
    height: 400,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tcpContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 45,
  },
  tcpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 20,
  },
  playMusicButton: {
    title: 'bold', //TODO: this is NOT WORKING, FIX
  },
});
