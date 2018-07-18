// @flow

import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Count from '../../components/Count';
import Avatar from '../../components/Avatar';
import CoverImage from '../../components/CoverImage';
import type { StreamUser, FollowCounts } from 'getstream';

type Props = {
  user: StreamUser,
};

type State = {
  user: FollowCounts & {
    data: {
      name?: string,
      url?: string,
      desc?: string,
      profileImage?: string,
      coverImage?: string,
    },
  },
};

class ProfileHeader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: {
        data: {
          counts: {},
        },
        following_count: 0,
        followers_count: 0,
      },
    };
  }

  async componentDidMount() {
    // TODO: Move this getOrCreate some place else, probably to app
    // initialization so only the profile request is needed
    await this.props.user.getOrCreate({
      name: 'Batman',
      url: 'batsignal.com',
      desc: 'Smart, violent and brutally tough solutions to crime.',
      profileImage:
        'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
      coverImage:
        'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
      counts: {
        following: 3000,
        followers: 1200000,
      },
    });
    let data = await this.props.user.profile();
    this.setState({ user: data });
  }

  render() {
    let {
      data: { name, url, desc, profileImage, coverImage },
      following_count,
      followers_count,
    } = this.state.user;

    coverImage ? StatusBar.setBarStyle('light-content', true) : null;

    return (
      <SafeAreaView style={[styles.profileHeader]}>
        {coverImage ? <CoverImage source={coverImage} /> : null}

        <View style={[styles.mainSection]}>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userUrl}>{url}</Text>
            <Text style={styles.userDesc}>{desc}</Text>
          </View>
          <Avatar source={profileImage} size={150} style={styles.avatar} />
        </View>

        <View style={styles.statSection}>
          <Count num={following_count}>Followers</Count>
          <Count num={followers_count}>Following</Count>
        </View>
      </SafeAreaView>
    );
  }
}

const margin = 15;

const styles = StyleSheet.create({
  profileHeader: {
    backgroundColor: '#fff',
    paddingBottom: margin,
    width: 100 + '%',
  },
  profileHeaderShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  mainSection: {
    width: 100 + '%',
    height: 150,
    marginTop: 90,
    marginBottom: 30,
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  userDetails: {
    flex: 1,
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
    lineHeight: 19,
    marginTop: 7,
  },
  statSection: {
    paddingLeft: margin * 2,
    paddingRight: margin,
    flexDirection: 'row',
  },
});

export default ProfileHeader;
