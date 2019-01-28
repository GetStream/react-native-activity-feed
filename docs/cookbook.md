
### Make a custom component with access to API client

Sometimes the functionality offered by the library is not enough and you need to use the API client directly.

#### Optional but suggested, make sure that you have Flow enabled to get type validation and hits

The entire library is covered with Flow, this really helps reducing the risk of bugs and simplifies coding a lot.

#### Create a component as StreamApp consumer

The API client is exposed by the `<StreamApp>` provider component, your component can access the already initialized API client
by subscribing to it. More information on this pattern is available on React's official [docs](https://reactjs.org/docs/context.html)

```jsx static
export default class ShareButton extends React.Component {

  render() {
    return (
      <StreamApp.Consumer>
        {(appCtx) => {
          return <ShareButtonInner activity={this.props.activity} {...this.props} {...appCtx} />;
        }}
      </StreamApp.Consumer>
    );
  }

}
```

#### Create an internal component that handles all logic

In order to keep code clean, we suggest splitting the code in two separate components; one subscribing to `StreamApp.Consumer` and another
receiving its props and do all the heavy lifting.

```jsx static
class ShareButtonInner extends React.Component {

    async onPress() {
        await this.props.client.reactions.add('share', this.props.activity);
    }

    render() {
        <View>
            <Text onPress={this.onPress}>Share</Text>
        </View>
    }

}
```

#### Render your component as <StreamApp> child

```jsx static

<StreamApp 
    {/* config props */}
>
    {/* ... */}

    <ShareButton 
        activity={activity}
    />

    {/* ... */}
</StreamApp>
```


Note: reading the code of the top-level components is highly suggested and probably the best way to find your way around.
