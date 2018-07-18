// @flow
declare module 'getstream' {
  declare type TimestampedResponse = {
    created_at: string,
    updated_at: string,
  };

  declare type UserResponse = {
    id: string,
    data: Object,
  } & TimestampedResponse;

  declare type FollowCounts = {
    following_count: number,
    followers_count: number,
  };

  declare type ProfileResponse = FollowCounts & UserResponse;

  declare class StreamUser {
    getOrCreate({}): Promise<UserResponse>;
    profile(): Promise<ProfileResponse>;
  }
}
