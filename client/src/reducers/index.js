import { combineReducers } from 'redux';

import serverStatus from './reducer_example';
import exchangeData from './exchange-data';


const rootReducer = combineReducers({
    serverStatus,
    exchangeData
});

export default rootReducer;
