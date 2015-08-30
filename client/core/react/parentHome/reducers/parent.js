import I from 'immutable';

let initialState = I.fromJS(current_user);

export default function parent(state=initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}