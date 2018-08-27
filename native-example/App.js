import React from 'react';
import { View, SafeAreaView, Platform } from 'react-native';

import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';

import {
  StreamApp,
  FlatFeed,
  BaseActivity,
  StatusUpdateFormSimple,
  LikeButton,
  FeedNotification,
} from 'react-native-activity-feed';

const App = () => {
  let apiKey = process.env['STREAM_API_KEY'];
  let appId = process.env['STREAM_APP_ID'];
  let token = process.env['STREAM_TOKEN'];

  if (!apiKey) {
    console.error('STREAM_API_KEY should be set');
    return null;
  }

  if (!appId) {
    console.error('STREAM_APP_ID should be set');
    return null;
  }

  if (!token) {
    console.error('STREAM_TOKEN should be set');
    return null;
  }

  // eslint-disable-next-line no-unused-vars
  function stepOne() {
    return (
      <StreamApp apiKey={apiKey} appId={appId} userId="batman" token={token} />
    );
  }

  // eslint-disable-next-line no-unused-vars
  function stepTwo() {
    return (
      <StreamApp apiKey={apiKey} appId={appId} userId="batman" token={token}>
        <FlatFeed />
      </StreamApp>
    );
  }

  // eslint-disable-next-line no-unused-vars
  function stepThree() {
    return (
      <StreamApp apiKey={apiKey} appId={appId} userId="batman" token={token}>
        <FlatFeed
          renderActivity={(props) => {
            return (
              <BaseActivity
                {...props}
                Footer={
                  <LikeButton
                    activity={props.activity}
                    onToggleReaction={props.onToggleReaction}
                  />
                }
              />
            );
          }}
        />
      </StreamApp>
    );
  }

  function statusUpdateForm() {
    if (Platform.OS === 'android') {
      return (
        <StatusUpdateFormSimple
          styles={{
            urlPreview: {
              wrapper: { padding: 8, paddingLeft: 15, paddingRight: 15 },
            },
          }}
        />
      );
    } else {
      return (
        <KeyboardAccessory>
          <StatusUpdateFormSimple
            styles={{
              urlPreview: {
                wrapper: { padding: 8, paddingLeft: 15, paddingRight: 15 },
              },
            }}
          />
        </KeyboardAccessory>
      );
    }
  }

  // eslint-disable-next-line no-unused-vars
  function stepFour() {
    return (
      <StreamApp apiKey={apiKey} appId={appId} userId="batman" token={token}>
        <FlatFeed
          renderActivity={(props) => {
            return (
              <BaseActivity
                {...props}
                Footer={
                  <View style={{ paddingLeft: 15 }}>
                    <LikeButton
                      activity={props.activity}
                      onToggleReaction={props.onToggleReaction}
                    />
                  </View>
                }
              />
            );
          }}
        />
        {statusUpdateForm()}
      </StreamApp>
    );
  }

  // eslint-disable-next-line no-unused-vars
  function stepFive() {
    const renderActivity = (props) => {
      return (
        <BaseActivity
          {...props}
          Footer={
            <View style={{ paddingLeft: 15 }}>
              <LikeButton
                activity={props.activity}
                onToggleReaction={props.onToggleReaction}
              />
            </View>
          }
        />
      );
    };

    return (
      <StreamApp apiKey={apiKey} appId={appId} userId="batman" token={token}>
        <FeedNotification />

        <FlatFeed renderActivity={renderActivity} />

        {statusUpdateForm()}
      </StreamApp>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* {stepOne()} */}
      {/* {stepTwo()} */}
      {/* {stepThree()} */}
      {stepFour()}
      {/* {stepFive()} */}
    </SafeAreaView>
  );
};

export default App;
