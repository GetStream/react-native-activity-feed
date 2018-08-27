// @flow
import React from 'react';
import { StatusBar, Image, TouchableOpacity, View } from 'react-native';

import {
  Avatar,
  FlatFeed,
  Activity,
  LikeButton,
  ReactionToggleIcon,
} from 'expo-activity-feed';

// $FlowFixMe https://github.com/facebook/flow/issues/345
import PostIcon from '../images/icons/post.png';

import type { NavigationScreen } from 'expo-activity-feed';
import type { NavigationEventSubscription } from 'react-navigation';

type Props = {|
  navigation?: NavigationScreen,
|};

class HomeScreen extends React.Component<Props> {
  _navListener: NavigationEventSubscription;
  static navigationOptions = ({ navigation }: Props) => ({
    title: 'HOME',
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13,
    },
    headerLeft: (
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={{ paddingLeft: 15 }}
      >
        <Avatar
          source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg"
          size={23}
          noShadow
        />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate('NewPost')}
        style={{ paddingRight: 15 }}
      >
        <Image source={PostIcon} style={{ width: 23, height: 23 }} />
      </TouchableOpacity>
    ),
  });

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  }

  _onPressActivity = (activity) => {
    this.props.navigation.navigate('SinglePost', {
      activity: activity,
    });
  };

  render() {
    return (
      <FlatFeed
        feedGroup="timeline"
        options={{
          limit: 10,
        }}
        navigation={this.props.navigation}
        renderActivity={(props) => (
          <TouchableOpacity
            onPress={() => this._onPressActivity(props.activity)}
          >
            <Activity
              {...props}
              Footer={
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <LikeButton {...props} />

                  <ReactionToggleIcon
                    activeIcon={require('../images/icons/reply.png')}
                    inactiveIcon={require('../images/icons/reply.png')}
                    labelSingle="comment"
                    labelPlural="comments"
                    counts={props.activity.reaction_counts}
                    kind="comment"
                    styles={{
                      container: {
                        alignSelf: 'flex-start',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 5,
                        paddingBottom: 5,
                        marginLeft: 15,
                      },
                      text: {
                        fontWeight: '700',
                        color: '#000',
                      },
                      image: {
                        marginRight: 5,
                        width: 24,
                        height: 24,
                      },
                    }}
                  />
                </View>
              }
            />
          </TouchableOpacity>
        )}
      />
    );
  }
}

export default HomeScreen;
