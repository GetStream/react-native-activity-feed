import React from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import { StreamApp, FlatFeed } from 'react-native-activity-feed';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}} forceInset={{ top: 'always' }}>
      <StreamApp
          apiKey="5rqsbgqvqphs"
          appId="40273"
          token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiZTI0MWU0ZWUtYjQ0OC00YWU5LTg0NTItYjFmMzA3ZjY2YmI3In0.tnV09TmKuQXfXBTdrQeECcqluJ4BuGHEw9YoWJIihUk"
      >
        <FlatFeed />
      </StreamApp>
    </SafeAreaView>
  );
};

export default App;