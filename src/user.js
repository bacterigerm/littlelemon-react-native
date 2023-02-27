import React, {createContext, useReducer} from 'react';


// 1. Sets the initial state when the app loads
const initialState = {
    loggedin: false,
    username: "",
    lastname: "",
    email: "",
    avatarimg: null,
};

// 2. Creates the context this is the thing our components import and use to get the state
export const AppContext = createContext();

// 3. Provider component - wraps the components we want to give access to the state
// Accepts the children, which are the nested(wrapped) components
export const AppProvider = (props) => {
    // 4. Sets up the app state. takes a reducer, and an initial state
    const [state, dispatch] = useReducer(AppReducer, initialState);

    return (
        <AppContext.Provider
            value={{
                loggedin: state.loggedin,
                username: state.username,
                lastname: state.lastname,
                email: state.email,
                avatarimg: state.avatarimg,
                dispatch,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};


// 5. The reducer - this is used to update the state, based on the action
export const AppReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOGGEDIN':
            state.loggedin = action.payload.loggedin;
            return {...state};
        case 'SET_USERNAME':
            state.username = action.payload.name;
            return {...state};
        case 'SET_LASTNAME':
            state.lastname = action.payload.lastname;
            return {...state};
        case 'SET_EMAIL':
            state.email = action.payload.email;
            return {...state};
        case 'SET_AVATAR':
            state.avatarimg = action.payload.avatarimg;
            return {...state};

        default:
            return state;
    }
};