```js
const View = require('react-native').View;

// this is just an example, you get this from a feed
const activity = {
    id: "a727d86e-aa95-11e8-9d38-1231d51167b4",
};

<StreamApp
    apiKey="5rqsbgqvqphs"
    appId={40273}
    userId="user-two"
    token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci10d28ifQ.1bHQRRYSW0SeTGz1ZnbvH-riClwiIMuUsJ68XK_9RUA">
    <SinglePost
        activity={activity}
        renderActivity={(props) => (
            <>
                <Activity
                {...props}
                Footer={
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <LikeButton {...props} />
                    </View>
                }
                />
                <CommentList reactions={props.activity.latest_reactions} />
                <View style={styles.sectionHeader} />
                <View style={styles.likesContainer}>
                <LikesList
                    reactions={props.activity.latest_reactions}
                />
                </View>
            </>
        )}
    />
</StreamApp>
```
