import React from 'react';
import { Button, Grid, Paper, makeStyles, fade, AppBar, Toolbar, Typography } from '@material-ui/core';
import db, {auth} from '../../firebase';
import logo from '../../logo8.png';

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
                        window.location.href = "/dashboard";
                    }else{
                        auth.signOut();
                        window.location.href = "/photog_login";
                        console.log("Not found");
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
            <img src={logo} alt='Not working' height='60'/>
            {/* Grapher */}
          </Typography>
          <div className={c.grow} />
        </Toolbar>
      </AppBar>
    </div>

    <br/><br/>

        <Grid container spacing={0.5} style={{display: "block-inline"}}>
            <Grid item xs={3} style={{marginLeft: "18vw"}}>
            <Paper className={classes.paper} >
                <div style={{marginBottom: "5vh"}}>
                    <br/><br/>
                    <Button color='primary' variant='contained' onClick={photogPage}> Are You a Photographer? </Button>
                    <br/><br/>
                    <img src='https://st4.depositphotos.com/10614052/i/600/depositphotos_288016322-stock-photo-male-photographer-on-white-background.jpg' height='300vh' width='300'/>
                    {/* <br/><br/>
                    <Button color='primary' variant='contained' href="/customer"> Looking to hire one? </Button> */}
                </div>
            </Paper>
            </Grid>
            <Grid item xs={3} style={{marginLeft: "15vw"}}>
            <Paper className={classes.paper} >
                <div style={{marginBottom: "5vh"}}>
                    {/* <br/><br/>
                    <Button color='primary' variant='contained' onClick={photogPage}> Are You a Photographer? </Button> */}
                    <br/><br/>
                    <Button color='primary' variant='contained' href="/customer"> Looking to hire one? </Button>
                    <br/><br/>
                    <img src='https://www.emmasedition.com/wp-content/uploads/2019/08/New-Poses-You-Can-Try-in-Photos-Emmas-Edition-6.jpg' height='300' width='250'/>
                </div>
            </Paper>
            </Grid>
        </Grid>
            
        </div>
    );
}
