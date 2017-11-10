import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css';
import 'cryptocoins-icons/webfont/cryptocoins.css'
import './index.css';


// Google's MuiThemeProvider
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

//Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
//import reducers from './reducers';
import rootReducer from './reducers/index';

require('dotenv').config();

const createStoreWithMiddleware = applyMiddleware(thunk, ReduxPromise)(createStore);

// Remote tap delay, essential for MaterialUI to work properly (temporary)
injectTapEventPlugin();

ReactDOM.render((
    <Provider store={createStoreWithMiddleware(rootReducer)}>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
            <App />
        </MuiThemeProvider>
    </Provider>
    ), document.getElementById('root'));
registerServiceWorker();
