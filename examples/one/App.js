import React from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import {
  StreamApp,
  FlatFeed,
  Activity,
  LikeButton,
  StatusUpdateForm,
} from 'react-native-activity-feed';

const CustomActivity = props => {
  return <Activity {...props} Footer={<LikeButton {...props} />} />;
};

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
      <StreamApp
        apiKey="5rqsbgqvqphs"
        appId="40273"
        token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiZTI0MWU0ZWUtYjQ0OC00YWU5LTg0NTItYjFmMzA3ZjY2YmI3In0.tnV09TmKuQXfXBTdrQeECcqluJ4BuGHEw9YoWJIihUk">
        <FlatFeed Activity={CustomActivity} />
        <StatusUpdateForm feedGroup="timeline" />
      </StreamApp>
    </SafeAreaView>
  );
};

export default App;
