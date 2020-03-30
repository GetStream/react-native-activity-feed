A version of [ReactionToggleIcon](#reactiontoggleicon) that's preconfigured for
likes. If you need more freedom to configure it use
[ReactionToggleIcon](#reactiontoggleicon) directly. Look at the source of this
component for reference.

```js
<StreamApp
  apiKey="5rqsbgqvqphs"
  appId={40273}
  userId="user-one"
  token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci1vbmUifQ.4_Ad0u46UZW_-icaAJwowzcryxtVW3uZMzadX3pyeAg"
>
  <div>
    <LikeButton
      // this is just a mock of the data to render the example
      activity={{
        own_reactions: { like: [1] },
        reaction_counts: { like: 7 },
      }}
    />

    <LikeButton
      // this is just a mock of the data to render the example
      activity={{
        reaction_counts: { like: 0 },
      }}
    />
  </div>
</StreamApp>
```
