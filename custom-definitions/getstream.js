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
    reactions: StreamReaction<*>;
    react<ReactionData>(
      kind: string,
      activity: string | ActivityResponse<*, *>, // allows activityId and ActivityResponse
      data?: {
        id?: string,
        data?: ReactionData,
        targetFeeds?: Array<StreamFeed<*, *> | string>, // allows feeds and feed ids
      },
    ): Promise<ReactionResponse<ReactionData>>;
  }

  declare class StreamObjectStore<ObjectData> {
    collection: string;
    object(id: ?string, data: ObjectData): StreamObject<ObjectData>;
    get(id: string): Promise<ObjectResponse<ObjectData>>;
    add(id: ?string, data: ObjectData): Promise<ObjectResponse<ObjectData>>;
  }

  declare class StreamReaction<ReactionData> {
    add(
      kind: string,
      activity: string | ActivityResponse<*, *>, // allows activityId and ActivityResponse
      data?: {
        id?: string,
        data?: ReactionData,
        targetFeeds?: Array<StreamFeed<*, *> | string>, // allows feeds and feed ids
      },
    ): Promise<ReactionResponse<ReactionData>>;
    delete(id: string): Promise<{}>;
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

  declare type FeedRequestOptions = {
    withReactionCounts?: boolean,
    withOwnReactions?: boolean,
    withOwnReactions?: boolean,
    limit?: number,
    offset?: number,
    id_lt?: string,
    id_lte?: string,
    id_gt?: string,
    id_gte?: string,
    ranging?: string,
  };

  declare class StreamFeed<UserData, CustomActivityData> {
    get(
      options?: FeedRequestOptions,
    ): Promise<FeedResponse<UserData, CustomActivityData>>;
    addActivity(
      ActivityArgData<UserData, CustomActivityData>,
    ): Promise<ActivityResponse<UserData, CustomActivityData>>;
  }

  declare type ActivityResponse<UserData, CustomActivityData> = {
    id: string,
    foreign_id: string,
    time: string,

    actor: UserResponse<UserData> | 'NotFound',
    verb: string,
    object: string | Object, // Limit this type more
    target: string,

    origin: null | string,
    to: Array<string>,

    reaction_counts?: { [string]: number },
    own_reactions?: { [string]: [] },
  } & CustomActivityData;

  declare type FeedResponse<UserData, CustomActivityData> = {
    results: Array<ActivityResponse<UserData, CustomActivityData>>,
    next: string,
    duration: string,
  };

  declare type ReactionResponse<ReactionData> = {
    id: string,
    kind: string,
    user_id: string,
    activity_id: string,
    data: ReactionData,
  } & TimestampedResponse;

  declare class StreamClient {
    createUserSession<UserData>(
      userId: string,
      token: string,
    ): StreamUserSession<UserData>;
  }
}
