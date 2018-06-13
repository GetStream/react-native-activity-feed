// @flow

import * as React from 'react';
import {StreamService} from './Service';

const StreamServiceContext = React.createContext();

type AppCtx = {
  service: StreamService
}

export class StreamApp extends React.Component {

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

export class StreamCurrentFeed extends React.Component {

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

export class StreamCurrentUser extends React.Component {

    render() {
        return (
            <StreamApp.Consumer>
                {appCtx => {
                    const currentUser = appCtx.service.getUserInfo(this.props.userId);
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
