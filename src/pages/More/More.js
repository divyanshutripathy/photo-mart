import React, {useEffect} from 'react';
import { Button } from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import {auth} from '../../firebase';

function More() {

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((_user) => {
          console.log(_user.uid);
        });
        return unsubscribe;
      }, []);

    return (
        <div>
            This is the more page!
            <Button color='primary' variant='contained' href='/'> Back </Button>
        </div>
    );
}

export default withRouter(More);