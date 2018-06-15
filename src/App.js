import React from 'react';
import { StyleSheet, Text, View, Image, StatusBar, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient} from 'expo';

export const isIphoneX = () => {
  let d = Dimensions.get("window");
  const { height, width } = d;

  return (
    // This has to be iOS duh
    Platform.OS === "ios" &&
    // Accounting for the height in either orientation
    (height === 812 || width === 812)
  );
};

export default class App extends React.Component {
  render() {
    StatusBar.setBarStyle('light-content', true);
    return <View style={styles.profileHeader}>
        {/* Gradient and background */}
        <View style={styles.profileCover}>
          <Image style={styles.profileCoverImage} source={{ uri: "http://gameranx.com/wp-content/uploads/2018/01/thumb-1920-532804.jpg" }} />
          <LinearGradient colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.0)", "rgba(255,255,255,0.0)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0.8)", "rgba(255,255,255,1)"]} style={styles.profileCoverGradient} />
        </View>

        <View style={styles.topSection}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainSection}>
          <View></View>
          <View style={styles.userAvatarView}>
            <Image style={styles.userAvatar} source={{ uri: "https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg" }} />
          </View>
        </View>
      </View>;
  }
}

const profileHeight = 200;

const styles = StyleSheet.create({
  profileHeader: { flex: 1},
  profileCover: { height: profileHeight, position: 'absolute', width: 100+ '%'},
  profileCoverGradient: { height: 200, width: 100 + '%', position: 'absolute' },
  profileCoverImage: {
    height: profileHeight, width: 100 + '%',
    position: 'absolute'
  },
  topSection: {
    height: isIphoneX ? 88 : 65,
    width: 100 + '%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 11,
  },
  mainSection: {
    height: 150,
    marginTop: 30,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  button: {
    backgroundColor: '#ffffff', padding: 10, paddingTop: 7, paddingBottom: 7, borderRadius: 4, opacity: 0.9
  },
  buttonText: {
    fontSize: 12
  },
  userAvatar: {
    width: 150, height: 150, borderRadius: 75,
    shadowOffset: { width: 30, height: 30, },
  },
  userAvatarView: {
    position: 'absolute',
    right: 14, bottom: 0,
    width:150, height: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  }



});
