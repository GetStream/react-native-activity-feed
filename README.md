Stream React Native Activity Feed Components
============================================

### Installation

```bash
npm i @stream-io/react-native
```

### Usage

#### Setup StreamApp component

In order to use Stream React Components in your application, you first need to initialize the `StreamApp` component. `StreamApp` holds your application config and acts as a service/data provider.

```jsx
<StreamApp
  apiKey="{API_KEY}"
  appId="{APP_ID}"
  userId="{USER_ID}"
  token="{TOKEN}"
  analyticsToken="{ANALYTICS_TOKEN}"
>
// everything from your application interacting with Stream should be nested here
</StreamApp>
```
1. **API_KEY** your Stream application API_KEY
2. **API_ID** your Stream application ID
3. **USER_ID** current user's ID
4. **TOKEN** the authentication token for current user
5. **ANALYTICS_TOKEN** [optional] the Analytics auth token

You can find your `API_KEY` and `APP_ID` on Stream's dashboard.

##### Generating user token

The authentication user token cannot be generated client-side (that would require sharing your API secret). You should provision a user token as part of the sign-up / login flow to your application from your backend.

```js
var client = stream.connect(API_KEY, API_SECRET);
var userToken = client.createUserSessionToken(userId);
```

##### Generating analytics token

React components have analytics instrumentation built-in, this simplifies the integration with Stream. In order to enable analytics tracking, you need to initialize `StreamApp` with a valid analytics token. You can generate this server-side as well.

```js
var client = stream.connect(API_KEY, API_SECRET);
var userToken = client.getAnalyticsToken();
```

### Copyright and License Information

Copyright (c) 2015-2018 Stream.io Inc, and individual contributors. All rights reserved.

See the file "LICENSE" for information on the history of this software, terms & conditions for usage, and a DISCLAIMER OF ALL WARRANTIES.
