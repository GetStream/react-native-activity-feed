// @flow

import * as React from 'react';
import {StreamService} from './Service';

const StreamServiceContext = React.createContext({service: new StreamService("", "", "")});

type AppCtx = {
  service: StreamService
}

type ReactChildren = React.Element<*>;

type BaseReactProps = {
    children?: ReactChildren,
    className?: string,
};

type StreamCredentialProps = {
    appId: string,
    apiKey: string,
    token: string,
} & BaseReactProps

export class StreamApp extends React.Component<StreamCredentialProps> {

  render() {
    let appCtx:AppCtx = {
      service: new StreamService(
        this.props.appId,
        this.props.apiKey,
        this.props.token)
    };
    return (
      <StreamServiceContext.Provider value={appCtx}>
        {this.props.children}
      </StreamServiceContext.Provider>
    )
  }

  static get Consumer() {
    return StreamServiceContext.Consumer
  }
}

const StreamFeedContext = React.createContext();

type StreamFeedProps = {
    feedSlug: string,
    userId: string,
} & BaseReactProps


export class StreamCurrentFeed extends React.Component<StreamFeedProps> {

  render() {
    return (
      <StreamApp.Consumer>
        {appCtx => {
          const currentFeed = appCtx.service.getFeed(this.props.feedSlug, this.props.userId);
          return (
            <StreamFeedContext.Provider value={currentFeed}>
              {this.props.children}
            </StreamFeedContext.Provider>
            )
          }
        }
      </StreamApp.Consumer>
    )
  }

  static get Consumer() {
    return StreamFeedContext.Consumer
  }
}

const StreamUserContext = React.createContext();

type StreamUserProps = {
    userId: string,
} & BaseReactProps


export class StreamCurrentUser extends React.Component<StreamUserProps> {

    render() {
        return (
            <StreamApp.Consumer>
                {appCtx => {
                    const currentUser = appCtx.service.getUser(this.props.userId);
                    return (
                        <StreamUserContext.Provider value={currentUser}>
                            {this.props.children}
                        </StreamUserContext.Provider>
                    )
                }
                }
            </StreamApp.Consumer>
        )
    }

    static get Consumer() {
        return StreamUserContext.Consumer
    }
}
