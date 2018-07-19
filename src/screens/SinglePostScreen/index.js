import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';

import { comments, likes, reposts } from '../../mock/data';

import BackButton from '../../components/BackButton';
import Activity from '../../components/Activity';
import Avatar from '../../components/Avatar';

import RepostItem from '../../components/RepostItem';
import CommentItem from '../../components/CommentItem';

import LikesList from '../../components/LikesList';

class SinglePostScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
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

  state = {
    loading: {
      comments: true,
      reposts: true,
      likes: true,
    },
    comments: [],
    reposts: [],
    likes: [],
  };

  componentDidMount() {
    console.log('enrichment of activity?');
    setTimeout(() => {
      console.log('getting comments, likes and reposts');
      this.setState({
        loading: {
          comments: false,
          reposts: false,
          likes: false,
        },
        comments: comments,
        reposts: reposts,
        likes: likes,
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout();
  }

  _onPressLike(id) {
    console.log('liked with id: ' + id);
  }

  _onPressReply(id) {
    console.log('reply to id: ' + id);
  }

  _onAvatarPress(id) {
    console.log('user id: ', id);
  }

  render() {
    const { navigation } = this.props;
    const item = navigation.getParam('item', 'no item found');
    return (
      <SafeAreaView style={styles.container} behaviour="height" enabled>
        <ScrollView style={styles.scrollContainer}>
          <Activity
            activity={item}
            onAvatarPress={() => this._onAvatarPress(item.id)}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Comments</Text>
          </View>

          <View style={styles.commentsContainer}>
            {this.state.loading.comments ? (
              <ActivityIndicator
                style={{ margin: 12 }}
                size="small"
                color="rgba(0,0,0,0.2)"
              />
            ) : (
              this.state.comments.map((item) => {
                return (
                  <CommentItem
                    key={item.id}
                    item={item}
                    onPressLike={this._onPressLike}
                    onPressReply={this._onPressReply}
                  />
                );
              })
            )}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Reposts</Text>
          </View>

          <View style={styles.repostsContainer}>
            {this.state.loading.reposts ? (
              <ActivityIndicator
                style={{ margin: 12 }}
                size="small"
                color="rgba(0,0,0,0.2)"
              />
            ) : (
              this.state.reposts.map((item) => {
                return (
                  <RepostItem
                    key={item.id}
                    item={item}
                    onPressLike={this._onPressLike}
                  />
                );
              })
            )}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Liked</Text>
          </View>
          <View style={styles.likesContainer}>
            {this.state.loading.likes ? (
              <ActivityIndicator
                style={{ margin: 12 }}
                size="small"
                color="rgba(0,0,0,0.2)"
              />
            ) : (
              <LikesList
                onAvatarPress={(id) => this._onAvatarPress(id)}
                likes={this.state.likes}
              />
            )}
          </View>
        </ScrollView>
        <View>
          <KeyboardAccessory>
            <View style={styles.replyContainer}>
              <Avatar
                source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg"
                size={48}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Share something..."
              />
            </View>
          </KeyboardAccessory>
        </View>
      </SafeAreaView>
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
  sectionHeader: {
    height: 30,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#DADFE3',
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 13,
    color: '#69747A',
  },
});

export default SinglePostScreen;
