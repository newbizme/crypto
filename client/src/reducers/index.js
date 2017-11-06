import { combineReducers } from 'redux';

import serverStatus from './reducer_example';
import exchangeData from './exchange-data';
import portfolio from './portfolio';


const rootReducer = combineReducers({
    serverStatus,
    exchangeData,
    portfolio
});

export default rootReducer;
