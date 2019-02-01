let client = stream.connect(
API_KEY,
API_SECRET,
);
let userToken = client.createUserToken(userId);

````
#### Generating analytics token

React components have analytics instrumentation built-in, this simplifies the integration with Stream. In order to enable analytics tracking, you need to initialize `StreamApp` with a valid analytics token. You can generate this server-side as well.

```js
var client = stream.connect(
  API_KEY,
  API_SECRET,
);
let userToken = client.getAnalyticsToken();
````

## Copyright and License Information

Copyright (c) 2015-2018 Stream.io Inc, and individual contributors. All rights reserved.

See the file "LICENSE" for information on the history of this software, terms & conditions for usage, and a DISCLAIMER OF ALL WARRANTIES.
