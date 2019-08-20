import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity, SafeAreaView } from 'react-native';
import {
  Avatar,
  StreamApp,
  FlatFeed,
  Activity,
  StatusUpdateForm,
  LikeButton,
  IconBadge,
  SinglePost,
  CommentBox,
  ReactionIcon,
  CommentList,
  RepostList,
  LikesList,
  CommentItem
} from 'react-native-activity-feed';

import { createAppContainer, createStackNavigator } from 'react-navigation';

const apiKey = '6hwxyxcq4rpe';
const appId = '35808';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmF0bWFuIn0.8MshXS9c3Du81ul3mWwuT6HH06fP45O-GvrOuJA82y4';

const HomeScreen = function (props) {
  _onPressActivity = (activity) => {
    props.navigation.navigate('SinglePost', {
      activity: activity,
    });
  };

  const renderActivity = (props) => (
    <TouchableOpacity
            onPress={() => _onPressActivity(props.activity)}
          >
      <Activity {...props} Footer={<LikeButton {...props} />} />
    </TouchableOpacity>
  );

  return (
    <StreamApp
      apiKey={apiKey}
      appId={appId}
      token={token}
      userId='batman'
      defaultUserData={{
        name: 'Batman',
        url: 'batsignal.com',
        desc: 'Smart, violent and brutally tough solutions to crime.',
        profileImage:
          'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
        coverImage:
          'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
      }}
    >
       <FlatFeed Activity={renderActivity} notify />
       <StatusUpdateForm feedGroup="timeline" />
    </StreamApp>
  );
}

class SinglePostScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: Props) => ({
    title: 'POST DETAIL',
  });

  render() {
    const { navigation } = this.props;
    const activity = navigation.getParam('activity');
    const feedGroup = navigation.getParam('feedGroup');
    const userId = navigation.getParam('userId');
    console.log(activity)
    return (
       <StreamApp
        apiKey={'6hwxyxcq4rpe'}
        appId={'35808'}
        token={'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmF0bWFuIn0.8MshXS9c3Du81ul3mWwuT6HH06fP45O-GvrOuJA82y4'}
        defaultUserData={{
          name: 'Batman',
          url: 'batsignal.com',
          desc: 'Smart, violent and brutally tough solutions to crime.',
          profileImage:
            'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
          coverImage:
            'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
        }}
      >
          <SinglePost
            activity={activity}
            feedGroup={feedGroup}
            options={{
              withOwnChildren: true
            }}
            userId={userId}
            navigation={this.props.navigation}
            Activity={(props) => (
              <React.Fragment>
                <Activity
                  {...props}
                  Footer={
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <LikeButton {...props} />

                      <ReactionIcon
                        labelSingle="comment"
                        labelPlural="comments"
                        counts={props.activity.reaction_counts}
                        kind="comment"
                      />
                    </View>
                  }
                />
                <CommentList
                  CommentItem={({ comment }) => (
                    <React.Fragment>
                      <CommentItem
                        comment={comment}
                        Footer={<LikeButton reaction={comment} {...props} />}
                      />
                    </React.Fragment>
                  )}
                  activityId={props.activity.id}
                  reactions={props.activity.latest_reactions} />
                {/* <RepostList reactions={props.activity.latest_reactions} /> */}

                {/* <View style={styles.sectionHeader} />
                <View style={styles.likesContainer}>
                  <LikesList
                    activityId={props.activity.id}
                    reactions={props.activity.latest_reactions}
                    reactionKind="heart"
                  />
                </View> */}
              </React.Fragment>
            )}
            Footer={(props) => {
              return (
                <CommentBox
                  onSubmit={(text) =>
                    props.onAddReaction('comment', activity, { text: text })
                  }
                  avatarProps={{
                    source: (userData: UserResponse) =>
                      userData.data.profileImage,
                  }}
                  styles={{ container: { height: 78 } }}
                />
              );
            }}
          />
      </StreamApp>

    );
  }
}



const Navigation = createStackNavigator({
  Home: HomeScreen,
  SinglePost: SinglePostScreen,
});

const AppContainer = createAppContainer(Navigation);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppContainer
