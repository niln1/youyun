import { Parent } from '../consts/ActionTypes';

export function addChild(child) {
    dispatch => {
        setTimeout(() => {
            dispatch(updateChild());
        }, 1000);
    };
}

function updateChild(child) {
    return {
        type: Parent.addChild,
        payload: {
            child: child
        }
    }
}