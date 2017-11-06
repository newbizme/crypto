import { 
    RETURN_TXNS,
    RETURN_PORTFOLIO
} from '../actions/portfolio';

const initialState = {
    txns: [],
    portfolio: []
};

const portfolio = (state = initialState, action) => {
    switch(action.type) {
        case RETURN_TXNS:
            return Object.assign({}, state, {
                txns: action.payload
            });
        case RETURN_PORTFOLIO:
            return Object.assign({}, state, {
                portfolio: action.payload
            });
        
        
        default:
            return state
    }
}

export default portfolio;