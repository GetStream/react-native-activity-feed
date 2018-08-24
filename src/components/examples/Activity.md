#### Simple message with mention

```js
const activity = {
    actor: {
        data: {
            name: 'Terry Walker',
            profileImage: 'https://randomuser.me/api/portraits/women/48.jpg',
        }
    },
    object: 'Hey @Thierry how are you doing?',
    verb: 'post',
    time: new Date()
};

<Activity 
    activity={activity}
/>
```

#### Activity with enriched URL

```js
const activity = {
    actor: {
        data: {
            name: 'Nora Ferguson',
            profileImage: 'https://randomuser.me/api/portraits/women/72.jpg',
        }
    },
    verb: 'post',
    object: 'Oh snap!',
    attachments: {
        og: {
            description: "Why choose one when you can wear both? These energizing pairings stand out from the crowd",
            title: "'Queen' rapper rescheduling dates to 2019 after deciding to &#8220;reevaluate elements of production on the 'NickiHndrxx Tour'",
            url: "https://www.rollingstone.com/music/music-news/nicki-minaj-cancels-north-american-tour-with-future-714315/",
            images: [{"image": "https://www.rollingstone.com/wp-content/uploads/2018/08/GettyImages-1020376858.jpg"}],
        }
    },
    time: new Date()
};

<Activity 
    activity={activity}
    imageWidth={900 }
/>
```

#### Activity with attached image and hashtag

```js
const activity = {
    actor: {
        data: {
            name: 'Nora Ferguson',
            profileImage: 'https://randomuser.me/api/portraits/women/72.jpg',
        }
    },
    verb: 'post',
    object: 'Just came back from this hike! #Hiking #Madeira',
    image: 'https://handluggageonly.co.uk/wp-content/uploads/2017/08/IMG_0777.jpg',
    time: new Date()
};

<Activity 
    activity={activity}
    imageWidth={900 }
/>
```

#### Activity with custom header

```js

const View = require('react-native').View;
const RepostIcon = require('./resources/repost.png');
const HeartIcon = require('./resources/heart.png');
const HeartIconOutline = require('./resources/heart-outline.png');
const ReplyIcon = require('./resources/reply.png');

const reaction_counts = {};

const activity = {
    actor: {
        data: {
            name: 'Nora Ferguson',
            profileImage: 'https://randomuser.me/api/portraits/women/72.jpg',
        }
    },
    verb: 'post',
    object: 'I just missed my train 😤',
    time: new Date()
};

<Activity 
    activity={activity}
    imageWidth={900}
    Footer={() => {
        return (
          <View
            style={{ paddingBottom: 15, paddingLeft: 15, paddingRight: 15 }}
          >
            <ReactionIconBar>
              <ReactionIcon
                icon={RepostIcon}
                counts={reaction_counts}
                kind={'repost'}
                width={24}
                height={24}
              />
              <ReactionToggleIcon
                activeIcon={HeartIcon}
                inactiveIcon={HeartIconOutline}
                kind={'heart'}
                counts={reaction_counts}
                width={24}
                height={24}
              />
              <ReactionIcon
                icon={ReplyIcon}
                counts={reaction_counts}
                kind={'comment'}
                width={24}
                height={24}
              />
            </ReactionIconBar>
          </View>
        );
    }}
/>
```
