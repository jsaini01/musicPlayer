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
import songs from '../views/data';

const {width, heigth} = Dimensions.get('window');

const MusicPlayer = () => {
  const [songIndex, setSongIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scrollX.addListener(({value}) => {
      //   console.log('value', `ScrollX : ${value} | Device Width : ${width}`);
      const index = Math.round(value / width);
      setSongIndex(index);
      //   console.log('index', index);
    });
  }, []);

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
            value={10}
            minimumValue={0}
            maximumValue={100}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#FFF"
            onSlidingComplete={() => {}}
          />
          {/* music duration */}
          <View style={style.progressLevelDuration}>
            <Text style={style.progressLableText}>00.00</Text>
            <Text style={style.progressLableText}>00.00</Text>
          </View>
        </View>
        {/* music controls */}
        <View style={style.musicControlsContainer}>
          <TouchableOpacity>
            <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ios-pause-circle" size={75} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity>
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
