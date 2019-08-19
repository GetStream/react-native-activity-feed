import React from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import {ScrollView, View} from 'react-native';
import {
  StreamApp,
  FlatFeed,
  Activity,
  LikeButton,
  StatusUpdateForm,
  ReactionIcon,
  CommentList,
  CommentBox
} from 'react-native-activity-feed';

const CustomActivity = props => {
  return (
    <Activity {...props} Footer={
      <View style= {{ marginTop: 15 }}>
        <View style= {{ flexDirection: 'row', alignItems: 'center' }}>
          <LikeButton reactionKind= "like" {...props} />
          <ReactionIcon
            labelSingle="comment"
            labelPlural="comments"
            counts={props.activity.reaction_counts}
            kind="comment"
          />
        </View>
        <CommentList style={{ marginTop: 15}} activityId= {props.activity.id} />
        <CommentBox style= {{ marginTop: 15}} noKeyboardAccessory= {true} activity={props.activity} onAddReaction= {props.onAddReaction} />
        <View style= {{ backgroundColor: '#DCDCDC', height: 10 }} />
      </View>
    } />
  );
};

const apiKey = '5rqsbgqvqphs'
const appId = '40273'
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiZTI0MWU0ZWUtYjQ0OC00YWU5LTg0NTItYjFmMzA3ZjY2YmI3In0.tnV09TmKuQXfXBTdrQeECcqluJ4BuGHEw9YoWJIihUk'

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
      <StreamApp
        apiKey={apiKey}
        appId={appId}
        token={token}>
        <FlatFeed Activity={CustomActivity} notify />
        <StatusUpdateForm feedGroup="timeline" />
      </StreamApp>
    </SafeAreaView>
  );
};




const App2 = () => {
  return (
    <SafeAreaView style= {{ flex: 1}} forceInset= {{ top: 'always' }}>
      {/* <ScrollView style= {{ flex: 1}}> */}
        <StreamApp
          apiKey={apiKey}
          appId={appId}
          token={token}>
          <StatusUpdateForm noKeyboardAccessory={true} feedGroup= "timeline"
            // onSuccess= {() => {
            //  this.onPostCreate()
            // }}
          />
          <FlatFeed
            notify
            style= {{ alignItems: 'stretch' }}
            Activity= {( data) => (
              <Activity
                {...data}
                // onPress= {() => {
                //   this.props.navigation.navigate('SinglePost', {
                //     activityId: data.activity.id,
                //     user_id: this.props.auth.userId,
                //     apiKey: this.state.apiKey,
                //     appId: this.state.appId,
                //     token: this.state.token
                //   })}
                // }
                style={{  justifyContent: 'space-between' }}
                Footer={
                  <View style={{ marginTop: 15 }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                      <LikeButton reactionKind= "like" {...data} />
                      <ReactionIcon
                        labelSingle="comment"
                        labelPlural="comments"
                        counts={data.activity. reaction_counts}
                        kind="comment"
                      />
                    </View>
                    <CommentList
                      style={{ marginTop: 15}}
                      activityId={data.activity.id}
                    />
                    <CommentBox
                      style= {{ marginTop: 15}}
                      noKeyboardAccessory={true}
                      activity={data.activity}
                      onAddReaction={data.onAddReaction}
                    />
                    <View style={{
                      backgroundColor: '#DCDCDC',
                      height: 10
                    }} />
                  </View>
                }
              />
            )}
          />
        </StreamApp>
      {/* </ScrollView> */}
    </ SafeAreaView>
  );
}


export default App2;
