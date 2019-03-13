A version of [ReactionToggleIcon](#reactiontoggleicon) that's preconfigured for
likes. If you need more freedom to configure it use
[ReactionToggleIcon](#reactiontoggleicon) directly. Look at the source of this
component for reference.

```js
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
```
