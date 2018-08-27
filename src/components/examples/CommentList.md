```js
const reactions = {'comment': [
    {
        user: {
            data: {
                name: 'Rosemary',
                profileImage: 'https://randomuser.me/api/portraits/women/20.jpg',
            }
        },
        data: {
            text: 'Me too!'
        }
    },
    {
        user: {
            data: {
                name: 'Nora Ferguson',
                profileImage: 'https://randomuser.me/api/portraits/women/72.jpg',
            }
        },
        data: {
            text: 'Kittie kittie kittie 🐱'
        }
    },
    {
        user: {
            data: {
            name: 'Terry Walker',
            profileImage: 'https://randomuser.me/api/portraits/women/48.jpg',
            }
        },
        data: {
            text: 'Snowboarding is awesome!'
        }
    }
]};

<CommentList 
    reactions={reactions}
/>
```