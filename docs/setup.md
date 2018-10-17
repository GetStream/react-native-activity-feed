This library provides components that intereact with Stream's APIs. In order to use the components you need to have an account and to nest the UI interacting with feeds inside the <StreamApp /> element which you must configure with the correct API keys and token.

```js static
<StreamApp
    apiKey={apiKey}
    appId={appId}
    token={token}
>
    <FlatFeed />
</StreamApp>
```

### Current user and defaults

Your token contains the user id of the user that uses your application. Because of this, all components will automatically use that as default for rendering feeds, adding activities and reactions such as comments and likes.

**Note:** most top level components like the flat feed, come with common default prop values (eg. userId, feed group, ...).
