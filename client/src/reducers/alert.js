import { SET_ALERT,REMOVE_ALERT } from './../actions/types';

export default function alert(state=[], action){
    const {type, payload} = action

    switch(type) {
        case SET_ALERT : return [...state, payload]
        case REMOVE_ALERT : return state.filter(alert => alert.id !== action.payload)
        default : return state;
    }
}