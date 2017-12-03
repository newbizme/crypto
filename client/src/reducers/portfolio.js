import { 
    RETURN_TXNS,
    RETURN_PORTFOLIO,
    RETURN_PORTFOLIO_SERIES,
    RETURN_MARKET_INFO
} from '../actions/portfolio';
import { LOGOUT_USER } from '../actions/index';

const initialState = {
    txns: [],
    portfolio: [],
    dataSeries: [],
    marketInfo: undefined
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
        case RETURN_PORTFOLIO_SERIES:
            return Object.assign({}, state, {
                dataSeries: action.payload
            })
        case RETURN_MARKET_INFO:
            return Object.assign({}, state, {
                marketInfo: action.payload
            })
        case LOGOUT_USER:
            return Object.assign({}, initialState);
        
        default:
            return state
    }
}

export default portfolio;