import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import songs from '../views/data';

const {width} = Dimensions.get('window');

// const setPlayer = async () => {
//   try {
//     await TrackPlayer.setupPlayer();
//     await TrackPlayer.add(songs);
//   } catch (e) {
//     console.log(e);
//   }
// };

// const tooglePlayBack = async playBackState => {
//   const currentTrack = await TrackPlayer.getCurrentTrack();
//   if (currentTrack != null) {
//     if (playBackState === State.Paused) {
//       await TrackPlayer.play();
//     } else {
//       await TrackPlayer.pause();
//     }
//   }
// };

const MusicPlayer = () => {
  const playBackState = usePlaybackState();
  const progress = useProgress();
  const [songIndex, setSongIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    // setPlayer();
    scrollX.addListener(({value}) => {
      //   console.log('value', `ScrollX : ${value} | Device Width : ${width}`);
      const index = Math.round(value / width);
      setSongIndex(index);
      console.log('index', index);
    });

    TrackPlayer.setupPlayer().then(async () => {
      console.log('first', 'playing');
      await TrackPlayer.add(songs);

      TrackPlayer.play();
    });
  }, []);

  const playPause = () => {
    if (playBackState === 'playing') {
      TrackPlayer.pause();
      setPlay(false);
    } else if (playBackState === 'paused') {
      TrackPlayer.play();
      setPlay(true);
    }
  };
  // const playPause = async () => {
  //   if (play === true) {
  //     TrackPlayer.setupPlayer().then(async () => {
  //       console.log('first', 'playing');
  //       await TrackPlayer.add(songs);
  //       TrackPlayer.play();
  //     });
  //   } else {
  //     TrackPlayer.reset();
  //   }
  // };

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };
  const skipToPrev = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  const renderSongs = ({item, index}) => {
    return (
      <Animated.View style={style.mainImageWrapper}>
        <View style={[style.imageWrapper, style.elevation]}>
          <Image source={item.artwork} style={style.musicImage} />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.mainContainer}>
        {/* image */}
        <Animated.FlatList
          ref={songSlider}
          renderItem={renderSongs}
          data={songs}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {x: scrollX},
                },
              },
            ],
            {useNativeDriver: true},
          )}
        />
        {/*song content */}
        <View>
          <Text style={[style.songContent, style.songTitle]}>
            {songs[songIndex].title}
          </Text>
          <Text style={[style.songContent, style.songArtist]}>
            {songs[songIndex].artist}
          </Text>
        </View>
        {/* slider */}
        <View>
          <Slider
            style={style.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#FFF"
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }}
          />
          {/* music duration */}
          <View style={style.progressLevelDuration}>
            <Text style={style.progressLableText}>
              {new Date(progress.position * 1000)
                .toLocaleTimeString()
                .substring(3)
                .replace('AM', '')
                .replace('PM', '')}
            </Text>
            <Text style={style.progressLableText}>
              {new Date((progress.duration - progress.position) * 1000)
                .toLocaleTimeString()
                .substring(3)
                .replace('AM', '')
                .replace('PM', '')}
            </Text>
          </View>
        </View>
        {/* music controls */}
        <View style={style.musicControlsContainer}>
          <TouchableOpacity onPress={skipToPrev}>
            <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={playPause}>
            <Ionicons
              name={
                playBackState === 'playing'
                  ? 'ios-pause-circle'
                  : 'ios-play-circle'
              }
              size={75}
              color="#FFD369"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext}>
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              color="#FFD369"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={style.bottomContainer}>
        <View style={style.bottomIconWrapper}>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={30} color="#888888" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="repeat" size={30} color="#888888" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={30} color="#888888" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={30} color="#888888" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MusicPlayer;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
    borderTopColor: '#393E46',
    borderWidth: 1,
  },
  bottomIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  mainImageWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 300,
    height: 340,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  elevation: {
    elevation: 5,
    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  songContent: {
    textAlign: 'center',
    color: '#EEEEEE',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  songArtist: {
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 35,
  },
  progressBar: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  progressLevelDuration: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLableText: {
    color: '#fff',
    fontWeight: '500',
  },
  musicControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 15,
  },
});
