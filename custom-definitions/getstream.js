// @flow
declare module 'getstream' {
  declare type TimestampedResponse = {
    created_at: string,
    updated_at: string,
  };

  declare type UserResponse<Data> = {
    id: string,
    data: Data,
  } & TimestampedResponse;

  declare type FollowCounts = {
    following_count: number,
    followers_count: number,
  };

  declare type ProfileResponse<Data> = FollowCounts & UserResponse<Data>;

  declare class StreamUser<Data> {
    id: string;
    full: UserResponse<Data>;
    data: ?Data;
    get(): Promise<UserResponse<Data>>;
    getOrCreate(Data): Promise<UserResponse<Data>>;
    create(Data): Promise<UserResponse<Data>>;
    update(Data): Promise<UserResponse<Data>>;
    profile(): Promise<ProfileResponse<Data>>;
  }

  declare class StreamUserSession<UserData> {
    user: StreamUser<UserData>;
    feed(feedGroup: string, userId?: string): StreamFeed;
  }

  declare class StreamFeed {}

  declare class StreamClient {
    createUserSession<UserData>(
      userId: string,
      token: string,
    ): StreamUserSession<UserData>;
  }
}
