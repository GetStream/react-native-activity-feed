import React from 'react';
import {View, Text, StyleSheet, StatusBar, Dimensions, Platform} from 'react-native';
import { SafeAreaView } from 'react-navigation';


import Count from "../../components/Count";
import Button from "../../components/Button";
import Avatar from "../../components/Avatar";
import CoverImage from "../../components/CoverImage";


const isIphoneX = () => {
  let d = Dimensions.get("window");
  const { height, width } = d;

  return (
    // This has to be iOS duh
    Platform.OS === "ios" &&
    // Accounting for the height in either orientation
    (height === 812 || width === 812)
  );
};

class ProfileHeader extends React.Component {

  render() {
    const { goBack } = this.props.navigation;
    const { name, url, desc, counts, profileImage, coverImage } = this.props.user;

    coverImage ? StatusBar.setBarStyle('light-content', true) : null;

    return (
      <SafeAreaView style={[styles.profileHeader]}>
        { coverImage ?
        <CoverImage source={coverImage} /> : null}

        <View style={styles.topSection}>
          <Button pressed={() => goBack()}>Back</Button>
          <Button pressed={() => console.log('navigate to edit profile')}>Edit Profile</Button>
        </View>

        <View style={[styles.mainSection]}>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userUrl}>{url}</Text>
            <Text style={styles.userDesc}>{desc}</Text>
          </View>
          <Avatar source={profileImage} size={150} style={styles.avatar} />
        </View>

        <View style={styles.statSection}>
          <Count num={counts.followers}>Followers</Count>
          <Count num={counts.following}>Following</Count>
        </View>
      </SafeAreaView>
    );
  }
}

const margin = 15;

const styles = StyleSheet.create({
  profileHeader: { backgroundColor: "#fff", paddingBottom: margin, width: 100 + '%' },
  profileHeaderShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },

  topSection: {
    width: 100 + "%",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 11
  },
  mainSection: {
    width: 100 + "%",
    height: 150,
    marginTop: 30,
    marginBottom: 30,
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  userDetails: {
    flex: 1
  },
  userName: {
    fontSize: 39,
    fontWeight: "600",
    color: "#364047"
  },
  userUrl: {
    fontSize: 12,
    color: "#364047"
  },
  userDesc: {
    fontSize: 14,
    fontWeight: "500",
    color: "#364047",
    lineHeight: 19,
    marginTop: 7
  },
  statSection: {
    paddingLeft: margin * 2,
    paddingRight: margin,
    flexDirection: "row"
  }
});

export default ProfileHeader;
