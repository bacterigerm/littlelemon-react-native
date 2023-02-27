import {useContext} from 'react';

import {AppContext} from './user';

const SaveUser = (localusername, localemail) => {

    const {dispatch,} = useContext(AppContext);
    dispatch({
        type: 'SET_USERNAME',
        payload: {name: localusername}
    })
    dispatch({
        type: 'SET_EMAIL',
        payload: {email: localemail}
    })
    return (<></>);
};

export default SaveUser;