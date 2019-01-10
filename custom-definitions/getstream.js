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
    full: ?UserResponse<Data>;
    data: ?Data;
    get(): Promise<UserResponse<Data>>;
    getOrCreate(Data): Promise<UserResponse<Data>>;
    create(Data): Promise<UserResponse<Data>>;
    update(Data): Promise<UserResponse<Data>>;
    profile(): Promise<ProfileResponse<Data>>;
  }

  declare type FollowResponse = DurationResponse;

  declare type ReactionRequestOptions = {
    id?: string,
    targetFeeds?: Array<StreamFeed<*, *> | string>, // Allows feeds and feed ids
    userId?: string,
  };

  declare class StreamClient<UserData, CollectionEntryData = {}> {
    userId: string;
    token: string;
    currentUser: StreamUser<UserData>;
    user(id: string): StreamUser<UserData>;
    createUserToken(string): string;
    feed<CustomActivityData>(
      feedGroup: string,
      userId?: string,
    ): StreamFeed<UserData, CustomActivityData>;
    collections: StreamCollections<CollectionEntryData>;
    reactions: StreamReaction<UserData, *>;
    images: StreamImageStore;
    files: StreamFileStore;
    og(url: string): Promise<OgData>;
  }

  declare type OgData = {
    title: string,
    description: string,
    site_name: string,
    images: Array<{ image: string }>,
    videos: Array<{
      video?: string,
      secure_url?: string,
      type?: string,
      width?: string,
      height?: string,
    }>,
    audios: Array<{
      type: string,
      audio: string,
    }>,
    url: string,
  };

  declare class StreamImageStore {
    upload: (
      uri: string | Blob | File,
      name?: ?string,
      contentType?: ?string,
    ) => Promise<{ file: string }>;
    delete: (uri: string) => Promise<{}>;
    process: (uri: string, options?: {}) => Promise<{}>;
    thumbnail: (
      uri: string,
      width: number,
      height: number,
      options?: { crop?: string, resize?: string },
    ) => Promise<{}>;
  }

  declare class StreamFileStore {
    upload: (
      uri: string | Blob | File,
      name?: ?string,
      contentType?: ?string,
    ) => Promise<{ file: string }>;
    delete: (uri: string) => Promise<{}>;
  }
  declare class StreamReaction<UserData, ReactionData> {
    add(
      kind: string,
      activity: string | ActivityResponse<*, *>, // Allows activityId and ActivityResponse
      data?: ReactionData,
      optionalArgs?: ReactionRequestOptions,
    ): Promise<ReactionResponse<UserData, ReactionData>>;
    addChild(
      kind: string,
      reaction: string | ReactionResponse<*, *>, // Allows activityId and ActivityResponse
      data?: ReactionData,
      optionalArgs?: ReactionRequestOptions,
    ): Promise<ReactionResponse<UserData, ReactionData>>;
    delete(id: string): Promise<{}>;
    update(
      id: string,
      data?: ReactionData,
      optionalArgs?: ReactionRequestOptions,
    ): Promise<ReactionResponse<UserData, ReactionData>>;
    filter(
      params: ReactionFilterOptions,
    ): Promise<ReactionFilterResponse<UserData, ReactionData>>;
  }

  declare class StreamCollections<EntryData> {
    entry(
      collection: string,
      entryId: string,
      data?: EntryData,
    ): CollectionEntry<EntryData>;
    add(
      collection: string,
      entryId: ?string,
      data: EntryData,
    ): Promise<CollectionEntry<EntryData>>;
    delete(collection: string, entryId: string): Promise<{}>;
    update(
      collection: string,
      entryId: string,
      data: {},
    ): Promise<CollectionEntry<EntryData>>;
    upsert(collection: string, Array<{ id: string } & EntryData>): Promise<{}>;
  }

  declare type ReactionFilterResponse<UserData, ReactionData> = {
    results: Array<ReactionResponse<UserData, ReactionData>>,
    next: string,
  };

  declare type CollectionEntryResponse<Data> = {
    id: string,
    collection: string,
    data: Data,
  } & TimestampedResponse;

  declare class CollectionEntry<Data> {
    id: string;
    data: Data;
    collection: string;
  }

  declare type ActivityArgData<UserData, CustomActivityData> = {
    foreign_id?: string,
    time?: string,
    actor: StreamUser<UserData>,
    verb: string,
    object: string | StreamUser<UserData> | CollectionEntry<mixed>,
    target?: string,
  } & CustomActivityData;

  declare type MarkValue = boolean | string;

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
    ranking?: string,
    mark_seen?: MarkValue,
    mark_read?: MarkValue,
    refresh?: boolean,
  };

  declare type ReactionFilterOptions = {
    activity_id?: string,
    user_id?: string,
    kind?: string,
    limit?: number,
    id_lt?: string,
    id_lte?: string,
    id_gt?: string,
    id_gte?: string,
  };

  declare class StreamFeed<UserData, CustomActivityData> {
    id: string;
    slug: string;
    userId: string;
    get(
      options?: FeedRequestOptions,
    ): Promise<FeedResponse<UserData, CustomActivityData>>;
    getActivityDetail(
      activityId: string,
      options?: FeedRequestOptions,
    ): Promise<FeedResponse<UserData, CustomActivityData>>;
    addActivity(
      ActivityArgData<UserData, CustomActivityData>,
    ): Promise<ActivityResponse<UserData, CustomActivityData>>;
    addActivities(
      Array<ActivityArgData<UserData, CustomActivityData>>,
    ): Promise<Array<ActivityResponse<UserData, CustomActivityData>>>;
    subscribe((any) => void): Subscription;
    removeActivity(id: string | { foreignId: string }): Promise<{}>;
  }
  declare type Subscription = {
    then: (success: () => mixed, failure: (err: Error) => mixed) => Promise<{}>,
    cancel: () => mixed,
  };

  declare type ReactionKindMap<UserData, ReactionData> = {
    [string]: Array<ReactionResponse<UserData, ReactionData>>,
  };

  declare type ReactionExtra = {
    next: string,
  };

  declare type ReactionExtraKindMap = {
    [string]: ReactionExtra,
  };

  declare type ReactionCounts = { [string]: number };

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

    reaction_counts?: ReactionCounts,
    own_reactions?: ReactionKindMap<UserData, Object>,
    latest_reactions?: ReactionKindMap<UserData, Object>,
    latest_reactions_extra?: ReactionExtraKindMap,
    activities: ?mixed, //
  } & CustomActivityData;

  declare type FeedResponse<UserData, CustomActivityData> = {
    unread?: number,
    unseen?: number,
    results: $ReadOnlyArray<
      | ActivityGroupResponse<UserData, CustomActivityData>
      | ActivityResponse<UserData, CustomActivityData>,
    >,
    next: string,
    duration: string,
  };

  declare type ActivityGroupResponse<UserData, CustomActivityData> = {
    id: string,
    verb: string,
    activities: $ReadOnlyArray<ActivityResponse<UserData, CustomActivityData>>,
    read?: boolean,
    seen?: boolean,
  };

  declare type ReactionResponse<UserData, ReactionData> = {
    id: string,
    kind: string,
    activity_id: string,
    data: ReactionData,
    user_id: string,
    user: UserResponse<UserData>,
    children_counts?: ReactionCounts,
    own_children?: ReactionKindMap<UserData, Object>,
    latest_children?: ReactionKindMap<UserData, Object>,
    latest_children_extra?: ReactionExtraKindMap,
  } & TimestampedResponse;

  declare type ConnectOptions = {
    location?: string,
    local: boolean,
    urlOverride?: {
      api?: string,
    },
    keepAlive?: boolean,
  };

  declare function connect<UserData>(
    apiKey: string,
    apiSecretOrToken: ?string,
    appId?: string | number,
    options?: Object,
  ): StreamClient<UserData>;

  declare var errors: {
    StreamApiError: Error,
  };
}
