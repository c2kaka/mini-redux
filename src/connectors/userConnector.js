import {connect} from '../redux.jsx'

const userSelector = (state) => {
    return { user: state.user };
};

const userDispatcher = (dispatch) => {
    return { updateUser: (payload) => dispatch({type: 'updateUser', payload}) };
};

export const connectUser = connect(userSelector, userDispatcher);

