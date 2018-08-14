// @flow
import stream from 'getstream';
import type { UserSession, CloudClient } from '../types';

async function main() {
  let apiKey = process.env['STREAM_API_KEY'] || '';
  let apiSecret = process.env['STREAM_API_SECRET'] || '';
  let appId = process.env['STREAM_APP_ID'] || '';
  let apiUrl = process.env['STREAM_API_URL'];

  console.log(apiKey, apiSecret, apiUrl);
  let client: CloudClient = stream.connectCloud(apiKey, appId, {
    urlOverride: {
      api: apiUrl,
    },
    keepAlive: false,
  });

  function createUserSession(userId): UserSession {
    return client.createUserSession(
      userId,
      stream.signing.JWTUserSessionToken(apiSecret, userId),
    );
  }

  let batman = createUserSession('batman');
  let content = 'test1';
  await batman.feed('notification').addActivity({
    actor: batman.user,
    verb: 'post',
    object: content,

    content: content,
  });
  console.log(await batman.feed('notification').get({ limit: 1 }));
}
main();
