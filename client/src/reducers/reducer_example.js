import { EXAMPLE } from '../actions/index';

export default function(state = 'Not Connected', action) {
    switch(action.type) {
        case EXAMPLE:
            console.log("reducer_example", action);
            return action.payload;
        
        default:
            return state || 'Not Connected';
    }

    return state;
}