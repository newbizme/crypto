import axios from 'axios';

export const EXAMPLE = 'EXAMPLE';
export const RETURN_PORTFOLIO_DATA = 'RETURN_PORTFOLIO_DATA';

export function updateServerStatus(status) {
    return {
        type: EXAMPLE,
        payload: status
    };
}

export function fetchPortfolioData() {
    return (dispatch, getState) => {
        axios.get('/api/v1/portfolio')
            .then((response) => {
                console.log(response);
                dispatch(returnPortfolioData(response.data));
            })
    };  
}

function returnPortfolioData(data) {
    return {
        type: RETURN_PORTFOLIO_DATA,
        payload: data
    };
}