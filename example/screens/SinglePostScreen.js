// @flow
import React from 'react';
import { SafeAreaView, View, TextInput, StyleSheet } from 'react-native';

import BackButton from '../components/BackButton';

import { Avatar, SinglePost } from 'react-native-activity-feed';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';

import Activity from '../components/Activity';
import LikesList from '../components/LikesList';
import RepostList from '../components/RepostList';
import CommentList from '../components/CommentList';

import type { NavigationProps } from '../types';

type Props = NavigationProps;

export default class SinglePostScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: Props) => ({
    title: 'POST DETAIL',
    headerLeft: (
      <View style={{ paddingLeft: 15 }}>
        <BackButton pressed={() => navigation.goBack()} color="blue" />
      </View>
    ),
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13,
    },
  });

  render() {
    const { navigation } = this.props;
    const activity = navigation.getParam('activity');
    const feedGroup = navigation.getParam('feedGroup');
    const userId = navigation.getParam('userId');
    return (
      <SafeAreaView style={styles.container} behaviour="height" enabled>
        <SinglePost
          activity={activity}
          feedGroup={feedGroup}
          userId={userId}
          navigation={this.props.navigation}
          renderActivity={(props) => (
            <React.Fragment>
              <Activity {...props} />
              <CommentList reactions={props.activity.latest_reactions} />
              <RepostList reactions={props.activity.latest_reactions} />

              <View style={styles.sectionHeader} />
              <View style={styles.likesContainer}>
                <LikesList
                  reactions={props.activity.latest_reactions}
                  reactionKind="heart"
                />
              </View>
            </React.Fragment>
          )}
        />
        <KeyboardAccessory>
          <View style={styles.replyContainer}>
            <Avatar
              source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg"
              size={48}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Share something..."
              underlineColorAndroid="transparent"
            />
          </View>
        </KeyboardAccessory>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  replyContainer: {
    height: 78,
    shadowOffset: { width: 0, height: -3 },
    shadowColor: 'black',
    shadowOpacity: 0.1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  textInput: {
    flex: 1,
    marginLeft: 25,
    fontSize: 16,
    color: '#364047',
  },
});
