import { RETURN_CMC_TABLE } from '../actions/market';

const initialState = [];

const portfolio = (state = initialState, action) => {
    switch(action.type) {
        case RETURN_CMC_TABLE:
            return action.payload;
        
        
        default:
            return state
    }
}

export default portfolio;