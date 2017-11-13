import axios from 'axios';

export const RETURN_CMC_TABLE = 'RETURN_CMC_TABLE';

export function fetchCMCTable() {
    return (dispatch, getState) => {
        axios.get('/api/v1/market/snapshot')
        .then((response) => {
            dispatch(returnCMCTable(response.data));
        })
    }
}

export function returnCMCTable(data) {
    return {
        type: RETURN_CMC_TABLE,
        payload: data
    };
}