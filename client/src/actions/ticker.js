import axios from 'axios';

export const RETURN_TICKERS = 'RETURN_TICKERS';

export function fetchTickers() {
    return (dispatch, getState) => {
        axios.get('/api/v1/tickers/all')
        .then((response) => {
            dispatch(returnTickers(response.data));
        })
    }
}

export function returnTickers(data) {
    return {
        type: RETURN_TICKERS,
        payload: data
    };
}