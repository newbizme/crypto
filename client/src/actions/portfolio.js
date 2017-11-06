import axios from 'axios';
import Auth from '../modules/auth';

export const RETURN_TXNS = 'RETURN_TXNS';
export const RETURN_PORTFOLIO = 'RETURN_PORTFOLIO';

// *****************************
// TRANSACTION FUNCTIONS
// *****************************

export function addTxn(txn) {
    return (dispatch, getState) => {
        // post(txn)
        console.log('Action>addTxn>', txn);

        var config = {
            headers: {'Authorization': `bearer ${Auth.getToken()}`}
        };
        var data = txn;
        // data['userID'] = Auth.getUser();

        axios.post('/user/v1/txns', data, config)
            .then((response) => {
                console.log(response);
                dispatch(fetchTxns());
            })
            .catch()
    };
};

export function deleteTxn(id) {
    return (dispatch, getState) => {
        var config = {
            headers: {'Authorization': `bearer ${Auth.getToken()}`}
        };
        axios.delete('/user/v1/txns/' + id, config)
            .then((response) => {
                dispatch(fetchTxns());
            })
            .catch((error) => {
                console.error('Error:',error);
            })
    }
}

export function fetchTxns() {
    return (dispatch, getState) => {

        axios.get('/user/v1/txns', { headers: {'Authorization': `bearer ${Auth.getToken()}`} })
            .then((response) => {
                console.log(response.data);
                dispatch(returnTxns(response.data.txns));
                dispatch(returnPortfolio(response.data.portfolio));
            })
            .catch((error) => {
                console.log('Error: ' + error);
            })
    };
}

function returnTxns(txns) {
    return {
        type: RETURN_TXNS,
        payload: txns
    };
}

function returnPortfolio(data) {
    return {
        type: RETURN_PORTFOLIO,
        payload: data
    };
};
