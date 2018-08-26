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
var Component = require('react').Component;
const styles = require('../src/styles.js').styles;
const StyleSheet = require('react-native').StyleSheet;

class KeyValue extends Component {
    render() {
        let {tuples} = this.props;
        return (
            <ul style={{'list-style': 'none'}}>
                {tuples.map( tuple => (
                    <li key={tuple[0]}>
                        {tuple[0]}: {JSON.stringify(tuple[1])}
                    </li>
                ))}
            </ul>
        );
    };
};

class StyleTable extends Component {
    render() {
        return (<div>
            {Object.keys(styles).map(s => {
                return (
                    <div>
                        <h4>{s}</h4>
                        {Object.keys(styles[s]).map(ss => {
                            const flatSS = StyleSheet.flatten(styles[s][ss]);
                            return (
                                <ul style={{'list-style': 'none'}}>
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
