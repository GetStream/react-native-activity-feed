// @flow
declare module 'getstream' {
  declare type TimestampedResponse = {
    created_at: string,
    updated_at: string,
  };
  declare type DurationResponse = {
    duration: string,
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

  declare type FollowResponse = DurationResponse;

  declare class StreamUserSession<UserData> {
    user: StreamUser<UserData>;
    feed<CustomActivityData>(
      feedGroup: string,
      userId?: string,
    ): StreamFeed<UserData, CustomActivityData>;
    followUser(StreamUser<UserData>): Promise<FollowResponse>;
    storage<ObjectData>(collectionName: string): StreamObjectStore<ObjectData>;
    objectFromResponse<ObjectData>(
      response: ObjectResponse<ObjectData>,
    ): StreamObject<ObjectData>;
  }

  declare class StreamObjectStore<ObjectData> {
    collection: string;
    object(id: ?string, data: ObjectData): StreamObject<ObjectData>;
    add(id: ?string, data: ObjectData): Promise<ObjectResponse<ObjectData>>;
  }

  declare type ObjectResponse<Data> = {
    id: string,
    collection: string,
    data: Data,
  } & TimestampedResponse;

  declare class StreamObject<Data> {
    id: ?string;
    data: ?Data;
    collection: string;
    store: StreamObjectStore<Data>;
  }

  declare type ActivityArgData<UserData, CustomActivityData> = {
    foreign_id?: string,
    time?: string,
    actor: StreamUser<UserData>,
    verb: string,
    object: string | StreamUser<UserData> | StreamObject<{}>,
    target?: string,
  };

  declare class StreamFeed<UserData, CustomActivityData> {
    get(): Promise<FeedResponse<UserData, CustomActivityData>>;
    addActivity(
      ActivityArgData<UserData, CustomActivityData>,
    ): Promise<ActivityResponse<UserData, CustomActivityData>>;
  }

  declare type ActivityResponse<UserData, CustomActivityData> = {
    id: string,
    foreign_id: string,
    time: string,

    actor: UserResponse<UserData>,
    verb: string,
    object: string | Object, // Limit this type more
    target: string,

    origin: null | string,
    to: Array<string>,
  } & CustomActivityData;

  declare type FeedResponse<UserData, CustomActivityData> = {
    results: Array<ActivityResponse<UserData, CustomActivityData>>,
    next: string,
    duration: string,
  };

  declare class StreamClient {
    createUserSession<UserData>(
      userId: string,
      token: string,
    ): StreamUserSession<UserData>;
  }
}
