// @flow
import type { UserResponse } from './types';
export function goToProfile(id: string) {
  // TODO: implement
  console.log('user id: ', id);
}

export function userOrDefault(
  user: UserResponse | string | {| error: string |},
): UserResponse {
  let actor: UserResponse;
  const notFound = {
    id: '!not-found',
    created_at: '',
    updated_at: '',
    data: { name: 'Unknown', profileImage: '' },
  };
  if (typeof user === 'string' || typeof user.error === 'string') {
    actor = notFound;
  } else {
    //$FlowBug
    actor = (user: any);
  }
  return actor;
}
