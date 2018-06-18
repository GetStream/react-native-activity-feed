import React from 'react';
import { StyleSheet, Text, View, Image, StatusBar, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient} from 'expo';
import Count from './components/Count';

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
  constructor(props) {
    super(props);
    this.state = {
      coverImage: 'a'
    }
  }
  render() {
    this.state.coverImage === "" ? StatusBar.setBarStyle("dark-content", true) : StatusBar.setBarStyle("light-content", true);

    return <View style={[styles.profileHeader, this.state.coverImage === '' ? styles.profileHeaderShadow : null]}>

        {/* Gradient and background only if profile cover exists */}
        { this.state.coverImage ? <View style={styles.profileCover}>
          <Image style={styles.profileCoverImage} source={{ uri: "http://gameranx.com/wp-content/uploads/2018/01/thumb-1920-532804.jpg" }} />
          <LinearGradient colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.0)", "rgba(255,255,255,0.0)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0.8)", "rgba(255,255,255,1)"]} style={styles.profileCoverGradient} />
        </View> : null }

        {/* Button section */}
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View style={styles.mainSection}>
          <View>
            <Text style={styles.userName}>Batman</Text>
            <Text style={styles.userUrl}>batsignal.com</Text>
            <Text style={styles.userDesc}>
              Smart, tough and brutally violent solutions to crime
            </Text>
          </View>
          <View style={styles.userAvatarView}>
            <Image style={styles.userAvatar} source={{ uri: "https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg" }} />
          </View>
        </View>

        {/* Stats section */}
        <View style={styles.statSection}>
          <Count num={12345}>Followers</Count>
          <Count num={34500000}>Following</Count>
        </View>
      </View>;
  }
}

const profileHeight = 200;
const avatarSize = 150;
const margin = 15;

const styles = StyleSheet.create({
  profileHeader: { backgroundColor: '#fff', paddingBottom: margin },
  profileHeaderShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileCover: { height: profileHeight, position: 'absolute', width: 100+ '%'},
  profileCoverGradient: { height: profileHeight, width: 100 + '%', position: 'absolute' },
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
    marginBottom: 30,
    paddingRight: 20, paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  button: {
    backgroundColor: '#ffffff', padding: 10, paddingTop: 7, paddingBottom: 7, borderRadius: 4, opacity: 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 12
  },
  userAvatar: {
    width: avatarSize, height: avatarSize, borderRadius: (avatarSize/2),
    shadowOffset: { width: 30, height: 30, },
  },
  userAvatarView: {
    position: 'absolute',
    right: margin, bottom: 0,
    width:avatarSize, height: avatarSize,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  userName: {
    fontSize: 39,
    fontWeight: '600',
    color: '#364047',
  },
  userUrl: {
    fontSize: 12,
    color: '#364047',
  },
  userDesc: {
    fontSize: 14,
    fontWeight: '500',
    color: '#364047',
    width: (Dimensions.get("window").width - avatarSize) - margin,
    lineHeight: 19,
    marginTop: 7,
  },
  statSection: {
    paddingLeft: margin*2, paddingRight: margin,
    flexDirection: 'row',
  }



});
