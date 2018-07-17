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

  declare class StreamUser {
    getOrCreate({}): Promise<UserResponse>;
  }
}
