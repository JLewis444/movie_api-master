export const SET_MOVIES = 'SET_MOVIES';
export const SET_FILTER = 'SET_FILTER';
export const SET_LOGGED_IN_USER = 'SET_LOGGED_IN_USER ';

export function setMovies(value) {
    return { type: SET_MOVIES, value };
}

export function setFilter(value) {
    return { type: SET_FILTER, value };
}

export function setLoggedInUser(value) {
    return { type: SET_LOGGED_IN_USER , value };
}