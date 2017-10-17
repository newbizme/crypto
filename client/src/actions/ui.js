//import axios from 'axios';

export const PORTFOLIO_MODAL_STATUS = 'PORTFOLIO_MODAL_STATUS';

export function togglePortfolioModal(bool) {
    return {
        type: PORTFOLIO_MODAL_STATUS,
        payload: bool
    };
}