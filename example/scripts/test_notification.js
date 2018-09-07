// @flow
import stream from 'getstream';
import type { UserSession, CloudClient } from '../types';

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
  let client: CloudClient = stream.connectCloud(apiKey, appId, {
    // urlOverride: {
    //   api: apiUrl,
    // },
    keepAlive: false,
  });

  function createUserSession(userId): UserSession {
    return client.createUserSession(
      stream.signing.JWTUserSessionToken(apiSecret, userId),
    );
  }

  let batman = createUserSession('batman');
  let content = 'test2';
  console.log(await batman.feed('notification').get({ limit: 1 }));
  await batman.feed('notification').addActivity({
    actor: batman.user,
    verb: 'post',
    object: content,

    content: content,
  });
  console.log(await batman.feed('notification').get({ limit: 1 }));
}
main();
