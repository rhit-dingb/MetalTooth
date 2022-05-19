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
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
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

const MusicPlayer = () => {
  const playbackState = usePlaybackState();
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

  return (
    <View style={styles.mainContainer}>
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
          value={10}
          minimumValue={0}
          maximumValue={100}
          thumbTintColor="black"
          minimumTrackTintColor="black"
          onSlidingComplete={() => {}}
        />
      </View>
      <View style={styles.progressLabelContainer}>
        <Text style={styles.progressLabelTxt}>0:00</Text>
        <Text style={styles.progressLabelTxt}>3:06</Text>
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
});
