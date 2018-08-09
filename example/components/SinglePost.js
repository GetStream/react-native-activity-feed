// @flow
import React from 'react';
import { View, SafeAreaView, StyleSheet, TextInput } from 'react-native';

import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';

import Activity from '../components/Activity';
import { FlatFeed, Avatar } from 'react-native-activity-feed';

import LikesList from '../components/LikesList';
import RepostList from '../components/RepostList';
import CommentList from '../components/CommentList';

import type { FeedRequestOptions } from 'getstream';
import type { NavigationProps, ActivityData } from '../types';

type Props = {|
  activity: ActivityData,
  feedGroup: string,
  userId?: string,
  options?: FeedRequestOptions,
  analyticsLocation?: string,
  ...NavigationProps,
|};

export default class SinglePost extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
        <SafeAreaView style={styles.container} behaviour="height" enabled>
          <FlatFeed
            feedGroup={this.props.feedGroup}
            userId={this.props.userId}
            options={{
              withRecentReactions: true,
            }}
            navigation={this.props.navigation}
            doFeedRequest={(session, feedGroup, userId, options) => {
              return session
                .feed(feedGroup, userId)
                .getActivityDetail(this.props.activity.id, options);
            }}
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
        </SafeAreaView>
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
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
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
