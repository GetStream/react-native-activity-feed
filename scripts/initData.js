// @flow

import stream from 'getstream/src/getstream-enrich';
import type { StreamClient } from 'getstream';

async function main() {
  let apiKey = process.env['STREAM_API_KEY'] || '';
  let apiSecret = process.env['STREAM_API_SECRET'] || '';
  let appId = process.env['STREAM_APP_ID'] || '';
  let apiUrl = process.env['STREAM_API_URL'];

  console.log(apiKey, apiSecret, apiUrl);
  let client: StreamClient = stream.connect(
    apiKey,
    null,
    appId,
    {
      urlOverride: {
        api: apiUrl,
      },
      browser: true,
    },
  );

  function createUserSession(userId) {
    return client.createUserSession(
      userId,
      stream.signing.JWTScopeToken(apiSecret, '', '', {
        userId: userId,
      }),
    );
  }

  let batman = createUserSession('batman');
  let fluff = createUserSession('fluff');
  let league = createUserSession('justiceleague');
  let bowie = createUserSession('davidbowie');

  await batman.user.getOrCreate({
    name: 'Batman',
    url: 'batsignal.com',
    desc: 'Smart, violent and brutally tough solutions to crime.',
    profileImage:
      'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
    coverImage:
      'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
  });

  await fluff.user.getOrCreate({
    name: 'Fluff',
    url: 'fluff.com',
    desc: 'Sweet I think',
    profileImage:
      'https://mylittleamerica.com/988-large_default/durkee-marshmallow-fluff-strawberry.jpg',
    coverImage: '',
  });

  await league.user.getOrCreate({
    name: 'Justice League',
    profileImage:
      'http://www.comingsoon.net/assets/uploads/2018/01/justice_league_2017___diana_hq___v2_by_duck_of_satan-db3kq6k.jpg',
  });

  await bowie.user.getOrCreate({
    name: 'David Bowie',
    profileImage:
      'http://www.officialcharts.com/media/649820/david-bowie-1100.jpg?',
  });
  console.log(await batman.followUser(fluff.user));
  await batman.followUser(bowie.user);
  await batman.followUser(league.user);
  await league.followUser(batman.user);

  await fluff.feed('user').addActivity({
    foreign_id: 'fluff-2',
    time: '2018-07-19T13:23:47',

    actor: fluff.user,
    verb: 'reply',
    object: fluff.user,

    content: 'Great podcast with @getstream and @feeds! Thanks guys!',
  });

  await league.feed('user').addActivity({
    foreign_id: 'league-2',
    time: '2018-07-19T13:15:12',

    actor: league.user,
    verb: 'post',
    object: '-',

    content: 'Wonder Woman is going to be great!',
    image:
      'http://www.comingsoon.net/assets/uploads/2018/01/justice_league_2017___diana_hq___v2_by_duck_of_satan-db3kq6k.jpg',
  });

  let response = await bowie.storage('podcast').add('hello-world-podcast', {
    title: 'Hello World',
    description: 'This is ground control for mayor Tom',
  });

  let podcast = bowie.objectFromResponse(response);

  await bowie.feed('user').addActivity({
    foreign_id: 'bowie-2',
    time: '2018-07-19T13:12:29',

    actor: bowie.user,
    verb: 'repost',
    object: podcast,

    content: 'Great podcast with @getstream and @feeds! Thanks guys!',
  });
}
main();
