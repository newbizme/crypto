import { RETURN_TICKERS } from '../actions/ticker';

const initialState = [];

const portfolio = (state = initialState, action) => {
    switch(action.type) {
        case RETURN_TICKERS:
            return action.payload;
        
        
        default:
            return state
    }
}

export default portfolio;