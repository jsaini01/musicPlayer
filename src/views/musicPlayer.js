import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackPlayer, {
  Event,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  RepeatMode,
} from 'react-native-track-player';
import songs from '../views/data';
import Style from '../styles/style';

const {width} = Dimensions.get('window');

const MusicPlayer = () => {
  const playBackState = usePlaybackState();
  const progress = useProgress();
  const [songIndex, setSongIndex] = useState(0);
  const [songTitle, setSongTitle] = useState();
  const [songArtist, setSongArtist] = useState();
  const [songArtwork, setSongArtWork] = useState();
  const [repeatMode, setRepeatMode] = useState('off');

  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);

  const repeatIcon = () => {
    if (repeatMode === 'off') {
      return 'repeat-off';
    }
    if (repeatMode === 'track') {
      return 'repeat-once';
    }
    if (repeatMode === 'repeat') {
      return 'repeat';
    }
  };

  const changeRepeatMode = () => {
    if (repeatMode === 'off') {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode('track');
    }
    if (repeatMode === 'track') {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode('repeat');
    }
    if (repeatMode === 'repeat') {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode('off');
    }
  };

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artwork, artist} = track;
      setSongTitle(title);
      setSongArtist(artist);
      setSongArtWork(artwork);
    }
  });
  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
  };

  useEffect(() => {
    scrollX.addListener(({value}) => {
      const index = Math.round(value / width);
      skipTo(index);
      setSongIndex(index);
    });

    TrackPlayer.setupPlayer().then(async () => {
      await TrackPlayer.add(songs);
    });
  }, []);

  const playPause = playBackState => {
    if (playBackState === 'ready' || playBackState === 'paused') {
      TrackPlayer.play();
    } else if (playBackState === 'playing') {
      TrackPlayer.pause();
    }
  };

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
      <Animated.View style={Style.mainImageWrapper}>
        <View style={[Style.imageWrapper, Style.elevation]}>
          <Image source={songArtwork} style={Style.musicImage} />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={Style.container}>
      <View style={Style.mainContainer}>
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
          <Text style={[Style.songContent, Style.songTitle]}>{songTitle}</Text>
          <Text style={[Style.songContent, Style.songArtist]}>
            {songArtist}
          </Text>
        </View>
        {/* slider */}
        <View>
          <Slider
            style={Style.progressBar}
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
          <View style={Style.progressLevelDuration}>
            <Text style={Style.progressLableText}>
              {new Date(progress.position * 1000)
                .toLocaleTimeString()
                .substring(3)
                .replace('AM', '')
                .replace('PM', '')}
            </Text>
            <Text style={Style.progressLableText}>
              {new Date((progress.duration - progress.position) * 1000)
                .toLocaleTimeString()
                .substring(3)
                .replace('AM', '')
                .replace('PM', '')}
            </Text>
          </View>
        </View>
        {/* music controls */}
        <View style={Style.musicControlsContainer}>
          <TouchableOpacity onPress={skipToPrev}>
            <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => playPause(playBackState)}>
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
      <View style={Style.bottomContainer}>
        <View style={Style.bottomIconWrapper}>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={30} color="#888888" />
          </TouchableOpacity>
          <TouchableOpacity onPress={changeRepeatMode}>
            <MaterialCommunityIcons
              name={`${repeatIcon()}`}
              size={30}
              color={repeatMode !== 'off' ? '#ffd369' : '#888888'}
            />
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
