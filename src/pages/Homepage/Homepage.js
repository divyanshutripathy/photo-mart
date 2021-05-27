import React from 'react';
import { Button, FormControl, Input, InputLabel } from '@material-ui/core';

export default function Homepage() {
    return (
        <div>
            <br/><br/>
            <Button color='primary' variant='contained' href='/photog_login'> Are You a Photographer? </Button>
            <br/><br/>
            <Button color='primary' variant='contained'> Looking to hire one? </Button>
        </div>
    );
}
