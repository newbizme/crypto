import { 
    RETURN_EXCHANGE_CONNECTIONS
} from '../actions/portfolio';

import { LOGOUT_USER } from '../actions/index';

const initialState = [];

const userExchanges = (state = initialState, action) => {
    switch(action.type) {
        case RETURN_EXCHANGE_CONNECTIONS:
            return action.payload;

        case LOGOUT_USER:
            return initialState;
        
        default:
            return state
    }
}

export default userExchanges;