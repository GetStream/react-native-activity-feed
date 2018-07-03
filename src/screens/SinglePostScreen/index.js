import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, FlatList, TextInput, KeyboardAvoidingView}  from 'react-native';

import BackButton from '../../components/BackButton';
import Activity from '../../components/Activity';
import Avatar from '../../components/Avatar';

class SinglePostScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "POST DETAIL",
    headerLeft: <BackButton pressed={() => navigation.goBack()} color="blue" />,
    headerStyle: {
      paddingLeft: 15,
      paddingRight: 15
    },
    headerTitleStyle: {
      fontWeight: "500",
      fontSize: 13
    },
    tabBarVisible: false
  });
  render() {
    const {navigation} = this.props;
    const item = navigation.getParam('item', 'no item found');
    return (
      <KeyboardAvoidingView style={styles.container} behaviour="height" enabled>
        <ScrollView style={styles.scrollContainer}>
          <Activity
            id={item.id}
            author={item.author}
            type={item.type}
            to={item.to}
            time={item.timestamp}
            content={item.content}
            image={item.image}
            link={item.link}
            object={item.object}
            static />


        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Comments</Text>
        </View>

        <View style={styles.commentsContainer}>
          <View style={styles.commentItem}>
            <Avatar source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg" size={25} noShadow />
            <View style={styles.commentText}>
              <Text>
                <Text style={styles.commentAuthor}>TheBat </Text>
                <Text style={styles.commentContent}>LOL! I bet he thinks this is great. </Text>
                <Text style={styles.commentTime}>2 mins</Text>
              </Text>
            </View>
            <View style={styles.commentActions}>
              <Image
                source={require('../../images/icons/reply.png')}
                style={styles.commentIcon} />
              <Image
                source={require('../../images/icons/heart-outline.png')}
                style={styles.commentIcon} />
            </View>
          </View>

          <View style={styles.commentItem}>
            <Avatar source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg" size={25} noShadow />
            <View style={styles.commentText}>
              <Text>
                <Text style={styles.commentAuthor}>TheBat </Text>
                  <Text style={styles.commentContent}>I am glad people are finally starting to see this! </Text>
                <Text style={styles.commentTime}>2 mins</Text>
              </Text>
            </View>
            <View style={styles.commentActions}>
              <Image
                source={require('../../images/icons/reply.png')}
                style={styles.commentIcon} />
              <Image
                source={require('../../images/icons/heart-outline.png')}
                style={styles.commentIcon} />
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Reposts</Text>
        </View>

        <View style={styles.repostsContainer}>
          <View style={styles.repostItem}>
            <View style={styles.repostAvatar}>
              <Avatar
                source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg"
                size={25}
                noShadow />
            </View>
            <Image source={require('../../images/icons/repost.png')} style={styles.repostIcon}/>
            <View style={styles.commentText}>
              <Text>
                <Text style={styles.commentAuthor}>TheBat </Text>
                <Text style={styles.commentContent}>So Smart!!! </Text>
                <Text style={styles.commentTime}>2 mins</Text>
              </Text>
            </View>
            <View style={styles.commentActions}>
              <Image
                source={require('../../images/icons/heart-outline.png')}
                style={styles.commentIcon} />
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Liked</Text>
        </View>
        <View style={styles.likesContainer}>
          <FlatList
            horizontal
            data={[{ id: 1 }, { id: 3 }, { id: 2 }, { id: 4 }, ]}
            keyExtractor={item => `${item.id}` }
            renderItem={({item}) => <View style={{marginRight: 10}}><Avatar source="https://placehold.it/100x100" size={25} noShadow/></View> }
           />
        </View>
        </ScrollView>
        <View style={styles.replyContainer}>
          <Avatar source="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Batman-BenAffleck.jpg/200px-Batman-BenAffleck.jpg" size={48}/>
          <TextInput style={styles.textInput} placeholder="Share something..." />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  scrollContainer: {
    flex: 1
  },
  replyContainer: {
    height: 78,
    shadowOffset: { width: 0, height: -3 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 15
  },
  textInput: {
    flex: 1,
    marginLeft: 25,
    fontSize: 16,
    color: "#364047"
  },
  sectionHeader: {
    height: 30,
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#DADFE3",
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    alignItems: "center"
  },
  sectionLabel: {
    fontSize: 13,
    color: "#69747A"
  },
  commentsContainer: {},
  commentItem: {
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 15,
    paddingLeft: 15,
    borderBottomColor: "#DADFE3",
    borderBottomWidth: 1
  },
  commentText: {
    flex: 1,
    marginLeft: 5,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  commentAuthor: {
    fontWeight: "700",
    fontSize: 14
  },
  commentContent: {
    fontSize: 14
  },
  commentTime: {
    fontSize: 14,
    color: "#95A4AD"
  },
  commentActions: {
    flexDirection: "row",
    marginLeft: 5
  },
  commentIcon: { width: 24, height: 24 },
  repostsContainer: {},
  repostItem: {
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 12,
    paddingTop: 12,
    alignItems: "center",
    borderBottomColor: "#DADFE3",
    borderBottomWidth: 1
  },
  repostAvatar: {
    marginRight: 5
  },
  repostIcon: {
    width: 20,
    height: 20
  },
  likesContainer: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 15,
    paddingLeft: 15
  }
});

export default SinglePostScreen;