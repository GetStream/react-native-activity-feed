
const comments = [
  {
    id: 1,
    author: {
      name: 'Janis Joplin',
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
    },
    content: 'I agree!',
    timestamp: '2mins'
  },
  {
    id: 2,
    author: {
      name: 'David Bowie',
      avatar: 'https://randomuser.me/api/portraits/men/20.jpg',
    },
    content: 'This is just the best',
    timestamp: '4mins'
  },
  {
    id: 3,
    author: {
      name: 'Wonder Woman',
      avatar: 'https://randomuser.me/api/portraits/women/19.jpg',
    },
    content: 'I am glad people are finally starting to see this!',
    timestamp: '6mins'
  },
]

const reposts = [
  {
    id: 1,
    author: {
      name: 'TheBat',
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg'
    },
    content: 'So Smart!',
    timestamp: '2mins'
  },
  {
    id: 2,
    author: {
      name: 'Lou Reed',
      avatar: 'https://randomuser.me/api/portraits/men/18.jpg'
    },
    content: 'This is great!!',
    timestamp: '4mins'
  },
]

const likes = [
  {
    id: 1,
    author: {
      name: 'TheBat',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
    }
  },
  {
    id: 2,
    author: {
      name: 'TheBat',
      avatar: 'https://randomuser.me/api/portraits/men/13.jpg'
    }
  },
  {
    id: 3,
    author: {
      name: 'TheBat',
      avatar: 'https://randomuser.me/api/portraits/women/14.jpg'
    }
  },
  {
    id: 4,
    author: {
      name: 'TheBat',
      avatar: 'https://randomuser.me/api/portraits/men/15.jpg'
    }
  },
  {
    id: 5,
    author: {
      name: 'TheBat',
      avatar: 'https://randomuser.me/api/portraits/women/16.jpg'
    }
  },
]

const activities = [
  {
    id: "1",
    author: {
      name: 'Fluff',
      handle: '@fluff',
      user_image: "https://mylittleamerica.com/988-large_default/durkee-marshmallow-fluff-strawberry.jpg"
    },
    type: 'reply',
    to: 'Fluff',
    content: "Great podcast with @getstream and @feeds! Thanks guys!",
    timestamp: '2mins'
  },
  {
    id: "2",
    author: {
      name: 'Justice League',
      handle: '@justiceleague',
      user_image: "http://www.comingsoon.net/assets/uploads/2018/01/justice_league_2017___diana_hq___v2_by_duck_of_satan-db3kq6k.jpg"
    },
    content: "Wonder Woman is going to be great!",
    timestamp: '4 mins',
    image: 'http://www.comingsoon.net/assets/uploads/2018/01/justice_league_2017___diana_hq___v2_by_duck_of_satan-db3kq6k.jpg'
  },
  {
    id: "3",
    author: {
      name: "David Bowie",
      handle: "@davidbowie",
      user_image: "http://www.officialcharts.com/media/649820/david-bowie-1100.jpg?"
    },
    content: "Great podcast with @getstream and @feeds! Thanks guys!",
    timestamp: '6 mins',
    link: true,
    object: {
      type: 'link',
      title: "Hello World",
      description: "This is ground control for mayor Tom"
    }
  },
]

const notifications = [
  {
    id: '1',
    type: 'like',
    actors: [
      { user_id: 1234, user_name: 'Frit Sissing', user_image: 'https://randomuser.me/api/portraits/men/12.jpg' },
      { user_id: 1235, user_name: 'Robbert ten Brink', user_image: 'https://randomuser.me/api/portraits/men/13.jpg' },
      { user_id: 1236, user_name: 'Sybrand Niessen', user_image: 'https://randomuser.me/api/portraits/men/44.jpg' }
    ],
    object: {
      type: 'link',
      title: 'Stream | API for building activity streams and news feeds',
      description: 'Stream, scalable news feeds and activity streams as a service. iOS, Android and web.',
      content: 'Great podcast with @getstream and @feeds! Thanks guys!',
      author: '@wonderwoman',
      timestamp: '2 mins'
    }
  },
  {
    id: '2',
    type: 'follow',
    follows: [
      {
        user_id: 123,
        user_image: 'https://randomuser.me/api/portraits/women/44.jpg',
        user_name: 'Beyonce'
      },
      {
        user_id: 234,
        user_image: 'https://randomuser.me/api/portraits/women/43.jpg',
        user_name: 'Wonderwoman'
      },
      {
        user_id: 345,
        user_image: 'https://randomuser.me/api/portraits/women/23.jpg',
        user_name: 'Wonderwoman'
      },
      {
        user_id: 456,
        user_image: 'https://randomuser.me/api/portraits/women/47.jpg',
        user_name: 'Wonderwoman'
      }
    ]
  },
  {
    id: '3',
    type: 'repost',
    actors: [
      { user_id: 1234, user_name: 'Sacha de Boer', user_image: 'https://randomuser.me/api/portraits/women/12.jpg' },
    ],
    object: {
      type: 'link',
      title: 'Tree House at the Shire - Treehouses for Rent in Conway',
      image: 'http://freepost.me/wp-content/uploads/2018/01/cabin-fresh-in-best-fire-pit-area-pits.jpg',
      description: 'This quaint little cabin in the trees was designed for a true get away'
    }
  },
  {
    id: '4',
    type: 'like',
    actors: [
      { user_id: 1234, user_name: 'Sacha de Boer', user_image: 'https://randomuser.me/api/portraits/women/12.jpg' },
      { user_id: 1235, user_name: 'Robbert ten Brink', user_image: 'https://randomuser.me/api/portraits/men/13.jpg' },
      { user_id: 1236, user_name: 'Sybrand Niessen', user_image: 'https://randomuser.me/api/portraits/men/44.jpg' },
      { user_id: 1236, user_name: 'Sybrand Niessen', user_image: 'https://randomuser.me/api/portraits/men/44.jpg' }
    ],
    object: {
      type: 'repost',
      content: 'Great podcast with @getstream and @feeds! Thanks guys!',
      author: '@wonderwoman',
      timestamp: '2 months'
    }
  },
  {
    id: '5',
    type: 'repost',
    actors: [
      { user_id: 1234, user_name: 'Dirk Kuijt', user_image: 'https://randomuser.me/api/portraits/men/64.jpg' },
    ],
    object: {
      type: 'post',
      content: 'Donec gravida risus dui, sed imperdiet odio tincidunt id. Nam egestas malesuada metus sit amet pretium.',
      timestamp: '2 weeks',

    }
  },
  {
    id: '6',
    type: 'repost',
    actors: [
      { user_id: 1234, user_name: 'Derk Bolt', user_image: 'https://randomuser.me/api/portraits/men/22.jpg' },
      { user_id: 1235, user_name: 'Robbert ten Brink', user_image: 'https://randomuser.me/api/portraits/men/13.jpg' },
    ],
    object: {
      type: 'comment'
    }
  }
]

export {likes, comments, reposts, activities, notifications}