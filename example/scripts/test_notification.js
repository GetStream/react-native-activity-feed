// @flow
import stream from 'getstream';

import dotenv from 'dotenv';
dotenv.config();

async function main() {
  let apiKey = process.env.STREAM_API_KEY;
  let apiSecret = process.env.STREAM_API_SECRET;
  let appId = process.env.STREAM_APP_ID;
  if (!apiKey) {
    console.error('STREAM_API_KEY should be set');
    return;
  }

  if (!appId) {
    console.error('STREAM_APP_ID should be set');
    return;
  }

  if (!apiSecret) {
    console.error('STREAM_SECRET should be set');
    return;
  }

  console.log(apiKey, apiSecret);
  let serverClient = stream.connect(
    apiKey,
    apiSecret,
    appId,
  );

  function createUserClient(userId) {
    return stream.connect(
      apiKey,
      serverClient.createUserToken(userId),
      appId,
    );
  }

  let batman = createUserClient('batman');
  let content = 'test2';
  console.log(await batman.feed('notification').get({ limit: 1 }));
  await batman.feed('notification').addActivity({
    actor: batman.currentUser,
    verb: 'post',
    object: content,

    content: content,
  });
  console.log(await batman.feed('notification').get({ limit: 1 }));
}
main();
