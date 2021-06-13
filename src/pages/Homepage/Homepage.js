import React from 'react';
import { Button, Grid, Paper, makeStyles, fade, AppBar, Toolbar, Typography } from '@material-ui/core';
import db, {auth} from '../../firebase';
import camart from '../../newCamWall.jpg';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));

const useStyles0 = makeStyles((theme) => ({ 
grow: {
    flexGrow: 1,
},
//   title: {
//     display: 'none',
//     [theme.breakpoints.up('sm')]: {
//       display: 'block',
//     },
//   },
search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
    backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
    },
},
searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
},
inputRoot: {
    color: 'inherit',
},
inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
    width: '20ch',
    },
},
}));


export default function Homepage() {

    function photogPage(){
        auth.onAuthStateChanged((_user) => {
            
            if (_user){
                let uid = _user.uid;
                db.collection('photographers').doc(uid).get().then(doc => {
                    if (doc.exists){
                        if ("categories" in doc.data()){
                            window.location.href = "/dashboard";
                        }else{
                            window.location.href = "/photog_login";
                        }
                    }else{
                        console.log("Nhi mila");
                    }
                })
            }else{
                window.location.href = '/photog_login';
            }
        })
    }

    const classes = useStyles();
    const c = useStyles0();


    return (
        <div>
            <div className={c.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={c.title} variant="h6" noWrap>
            Grapher-Mart
          </Typography>
          <div className={c.grow} />
        </Toolbar>
      </AppBar>
    </div>

    <br/><br/>

        <Grid container spacing={0.5}>
            <Grid item xs={3} style={{marginLeft: "36vw"}}>
            <Paper className={classes.paper} >
                <div style={{marginBottom: "5vh"}}>
                    <br/><br/>
                    <Button color='primary' variant='contained' onClick={photogPage}> Are You a Photographer? </Button>
                    <br/><br/>
                    <Button color='primary' variant='contained'> Looking to hire one? </Button>
                </div>
            </Paper>
            </Grid>
        </Grid>
            
        </div>
    );
}
