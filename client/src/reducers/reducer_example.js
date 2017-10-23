import { EXAMPLE } from '../actions/index';

export default function(state = 'Not Connected', action) {
    switch(action.type) {
        case EXAMPLE:
            return action.payload;
        
        default:
            return state || 'Not Connected';
    }

    return state;
}