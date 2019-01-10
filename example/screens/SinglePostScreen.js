// @flow
import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';

import {
  SinglePost,
  CommentBox,
  BackButton,
  Activity,
  LikeButton,
  ReactionIcon,
  CommentList,
  CommentItem,
  LikeList,
} from 'expo-activity-feed';

import RepostList from '../components/RepostList';

import type { UserResponse } from '../types';
import type { NavigationScreen } from 'expo-activity-feed';

import ReplyIcon from '../images/icons/reply.png';

type Props = {|
  navigation: NavigationScreen,
|};

export default class SinglePostScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: Props) => ({
    title: 'POST DETAIL',
    headerLeft: (
      <View style={{ paddingLeft: 15 }}>
        <BackButton pressed={() => navigation.goBack()} blue />
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
      <SafeAreaView style={styles.container}>
        <SinglePost
          activity={activity}
          feedGroup={feedGroup}
          userId={userId}
          options={{ withOwnChildren: true }}
          navigation={this.props.navigation}
          Activity={(props) => (
            <React.Fragment>
              <Activity
                {...props}
                Footer={
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LikeButton reactionKind="heart" {...props} />

                    <ReactionIcon
                      icon={ReplyIcon}
                      labelSingle="comment"
                      labelPlural="comments"
                      counts={props.activity.reaction_counts}
                      kind="comment"
                    />
                  </View>
                }
              />
              <View style={styles.likesContainer}>
                <LikeList activityId={props.activity.id} reactionKind="heart" />
              </View>
              <RepostList activityId={props.activity.id} />
              <CommentList
                activityId={props.activity.id}
                infiniteScroll
                reverseOrder
                CommentItem={({ comment }) => (
                  <React.Fragment>
                    <CommentItem
                      comment={comment}
                      Footer={<LikeButton reaction={comment} {...props} />}
                    />
                  </React.Fragment>
                )}
              />

              <View style={styles.sectionHeader} />
            </React.Fragment>
          )}
          Footer={(props) => {
            return (
              <CommentBox
                activity={activity}
                onAddReaction={props.onAddReaction}
                avatarProps={{
                  source: (userData: UserResponse) =>
                    userData.data.profileImage,
                }}
                styles={{ container: { height: 78 } }}
              />
            );
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
