Components from this library come with default styling which you can overwrite via the `styles` props.

You can also change specific styles globally using the `updateStyle` function from the `styles` module.

```js static

import { updateStyle } from 'expo-activity-feed';

updateStyle('avatar', {
    container: {
        shadowColor: '#fff',
    }
});

```

Here is the list of all styles organized by component name:

```jsx noeditor
var PureComponent = require('react').PureComponent;
const styles = require('../src/styles.js').styles;
const StyleSheet = require('react-native').StyleSheet;

class KeyValue extends PureComponent {
    render() {
        let {tuples} = this.props;
        return (
            <ul style={{'listStyle': 'none'}}>
                {tuples.map( tuple => (
                    <li key={tuple[0]}>
                        {tuple[0]}: {JSON.stringify(tuple[1])}
                    </li>
                ))}
            </ul>
        );
    };
};

class StyleTable extends PureComponent {
    render() {
        return (<div>
            {Object.keys(styles).map(s => {
                return (
                    <div>
                        <h4>{s}</h4>
                        {Object.keys(styles[s]).map(ss => {
                            const flatSS = StyleSheet.flatten(styles[s][ss]);
                            return (
                                <ul style={{'listStyle': 'none'}}>
                                    <li>{ss}:</li>
                                    <li>
                                        <KeyValue
                                            tuples={Object.keys(flatSS).map(k => ([k, flatSS[k]]))}
                                        />
                                    </li>
                                </ul>
                            )
                        })}
                    </div>
                );
            })}
        </div>);
    }
};

<StyleTable />
```
