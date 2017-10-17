import { combineReducers } from 'redux';

import exampleReducer from './reducer_example';


const rootReducer = combineReducers({
    serverStatus: exampleReducer,
});

export default rootReducer;
