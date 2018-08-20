/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { View } from 'react-native';
import {
  StreamApp,
  FlatFeed,
  BaseActivity,
  Button,
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

  function stepOne() {
    return (
      <StreamApp
        apiKey={apiKey}
        appId={appId}
        userId="batman"
        token={token}
        realtimeToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6Im5vdGlmaWNhdGlvbmJhdG1hbiJ9.Ztf103rqNTaOq4cr9VDPfluNDW5Q8LXE28GcQYY9mzs"
        defaultUserData={{
          name: 'Batman',
          url: 'batsignal.com',
          desc: 'Smart, violent and brutally tough solutions to crime.',
          profileImage:
            'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
          coverImage:
            'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
        }}
      />
    );
  }

  function stepTwo() {
    return (
      <StreamApp
        apiKey={apiKey}
        appId={appId}
        userId="batman"
        token={token}
        realtimeToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6Im5vdGlmaWNhdGlvbmJhdG1hbiJ9.Ztf103rqNTaOq4cr9VDPfluNDW5Q8LXE28GcQYY9mzs"
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
        <FlatFeed />
      </StreamApp>
    );
  }

  function stepThree() {
    return (
      <StreamApp
        apiKey={apiKey}
        appId={appId}
        userId="batman"
        token={token}
        realtimeToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6Im5vdGlmaWNhdGlvbmJhdG1hbiJ9.Ztf103rqNTaOq4cr9VDPfluNDW5Q8LXE28GcQYY9mzs"
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
        <FlatFeed
          renderActivity={(props) => {
            return (
              <BaseActivity
                {...props}
                Footer={
                  <View style={{ paddingLeft: 15 }}>
                    <Button
                      count={props.activity.reaction_counts.heart}
                      on={
                        props.activity.own_reactions.heart &&
                        Boolean(props.activity.own_reactions.heart.length)
                      }
                      onPress={() =>
                        props.onToggleReaction('heart', props.activity)
                      }
                      icon={{
                        //$FlowFixMe
                        on: require('../example/images/icons/heart.png'),
                        //$FlowFixMe
                        off: require('../example/images/icons/heart-outline.png'),
                      }}
                      label={{
                        single: 'like',
                        plural: 'likes',
                      }}
                    />
                  </View>
                }
              />
            );
          }}
        />
      </StreamApp>
    );
  }

  return (
    <React.Fragment>
      {stepOne()}
      {stepTwo()}
      {stepThree()}
    </React.Fragment>
  );
};

export default App;
