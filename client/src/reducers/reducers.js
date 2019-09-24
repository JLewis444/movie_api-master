import { combineReducers } from 'redux';

import { SET_FILTER, SET_MOVIES,SET_LOGGED_IN_USER  } from '../actions/actions';

let initialState = {
  movies : [],
  user: null
}
function visibilityFilter(state = '', action) {
    switch (action.type) {
        case SET_FILTER:
            return action.value;
            default:
                return state;
    }
}

function movies(state = [], action) {
    switch (action.type) {
        case SET_MOVIES:
            return action.value
            default:
                return state;
    }
}

function user(state = null, action) {
    switch (action.type) {
        case SET_LOGGED_IN_USER :
            return action.value
            default:
                return state;
    }
}

const moviesApp = combineReducers({
    visibilityFilter,
    movies,
    user
});


export default moviesApp;
