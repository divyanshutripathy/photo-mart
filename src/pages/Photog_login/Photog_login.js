import React, {useRef, useState, useEffect} from 'react';
import { Button, FormControl, Input, InputLabel, AppBar, Toolbar, Typography, makeStyles, fade, Grid, Paper, Link } from '@material-ui/core';
import './Photog_login.css';
import db, {auth} from '../../firebase';
import firebase from "firebase";
import Category from '../Category/Category';
// import { StateDropdown, RegionDropdown } from 'react-indian-state-region-selector';
import csc from 'country-state-city';
import Select from 'react-select';

export const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: 'inherited',//theme.palette.text.secondary,
    },
  }));

export const useStyles0 = makeStyles((theme) => ({ 
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

export default function Photog_login() {

    const [login, setLogin] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [conf, setConf] = useState("")
    const [no, setNo] = useState("");
    const [city, setCity] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [error1, setError1] = useState("");
    const [error2, setError2] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((_user) => {
            if (_user){
                let uid = _user.uid;
                db.collection('photographers').doc(uid).get().then(doc => {
                    if (doc.exists){
                        if ("categories" in doc.data()){
                            window.location.href = "/dashboard";
                        }else{
                            setLogin(2);
                        }
                    }else{
                        console.log("Nhi mila");
                    }
                })
            }
        })
        return unsubscribe;
    }, [])

    useEffect(() => {
        const nstates = csc.getStatesOfCountry("IN");
        const options = nstates.map((state) =>({
            'value': state.isoCode,
            'label': state.name
        }
        ))
        setStates(options);
    }, [])


    const emailRef = useRef(null);
    const passRef = useRef(null);

    function handleLogin(event){
        event.preventDefault();
        auth.signInWithEmailAndPassword(
            emailRef.current.value,
            passRef.current.value
        ).then(user => {
            var uid = user.user.X.X;
            db.collection('photographers').doc(uid).get().then(doc => {
                if (doc.exists){
                    if ("categories" in doc.data()){
                        window.location.href = "/dashboard";
                    }else{
                        setLogin(2);
                    }
                }else{
                    console.log("Nhi mila");
                }
            });
        }).catch(error => {
            setError1("Invalid credentials");
        })
    }

    function cityForState(event){
        setSelectedState(event.label);
        const cities = csc.getCitiesOfState("IN", event.value);
        console.log(cities);
        const options = cities.map((cit) =>({
            'value': cit.stateCode,
            'label': cit.name
        }
        ))
        setCity(options);
    }

    function handleSignup(event){
        event.preventDefault();
        console.log(emailRef.current.value, conf, pass);

        var isNum = function(ch){
            return /^[0-9]$/i.test(ch);
        }

        let uid = "";

        if (pass === "" || conf === "" || no === "" || name === "" || email === "" || selectedCity === "" || selectedState === ""){
            setError2("Please fill the form completely");
            return;
        }
        
        let flag = true;
        for (var i = 0; i < no.length; i++){
            if (!isNum(no[i])){
                flag = false;
                break;
            }
        }
        
        if (no.length < 10 || !flag){
            setError2("Please fill a proper contact number");
            return;
        }

        if (!email.includes("@")){
            setError2("Please enter a proper email");
            return;
        }

        if (pass === conf){
            auth.createUserWithEmailAndPassword(
                emailRef.current.value,
                passRef.current.value
            ).then(_user => {
                console.log("chomu");
                console.log(_user);
                uid = _user.user.X.X;
                db.collection('photographers').doc(uid).set({
                    Name: name,
                    Email: email,
                    No: no,
                    State: selectedState,
                    City: selectedCity,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(
                    () => console.log("Registered!"),
                    (error) => setError2(error.message)
                );
                setLogin(2);
            }).catch(error => {
                setError2(error.message);
            })

        }else{
            setError2("Password doesn't match!");
        }
    }

    const classes = useStyles();
    const c = useStyles0();
    
    if (login === 1){ // Signup form
        return (
            <div>
                <div className={c.grow}>
                    <AppBar position="static">
                        <Toolbar>
                        <Link href="/" style={{color: 'white', textDecoration: 'none'}}>
                        <Typography className={c.title} variant="h6" noWrap>
                            Grapher-Mart
                        </Typography>
                        </Link>
                        <div className={c.grow} />
                        </Toolbar>
                    </AppBar>
                </div>

                <br/><br/>
        <Grid container spacing={0.5} >
        <Grid item xs={4} style={{marginLeft: "36vw"}}>
            <Paper className={classes.paper} style={{marginRight: '-1vw'}}>  
            <div className='login__form'>
                <Button color='primary' variant='contained' onClick={event => setLogin(0)}> Login </Button>
                <Button color='primary' id='signup' variant='contained' onClick={event => setLogin(1)}> Signup </Button>
                <br/><br/>

                { error2 && <h3 style={{color: '#ff0033'}}> { error2 } </h3> }

                <FormControl fullWidth="true">
                <InputLabel>Full Name</InputLabel>
                <Input fullWidth="true" value={name} onChange={event => setName(event.target.value)}/>
                </FormControl>
                <br/><br/>

                <FormControl fullWidth="true">
                <InputLabel>Email</InputLabel>
                <Input fullWidth="true" value={email} inputRef={emailRef} onChange={event => setEmail(event.target.value)}/>
                </FormControl>
                <br/><br/>

                <FormControl fullWidth="true">
                <InputLabel>Work Phone No.</InputLabel>
                <Input fullWidth="true" value={no} onChange={event => setNo(event.target.value)} inputProps={{maxlength: "10"}}/>
                </FormControl>
                <br/><br/>

                {/* State Selector  */}
                <Select options={states} placeholder='Select State' onChange={event => cityForState(event)} />
                <br/>

                {/* City Selector  */}
                <Select options={city} placeholder='Select City' onChange={event => setSelectedCity(event.label)} />
                <br/>

                <FormControl fullWidth="true">
                <InputLabel>Password (at least 6 characters) </InputLabel>
                <Input fullWidth="true" type='password' inputRef={passRef} value={pass} onChange={event => setPass(event.target.value)}/>
                </FormControl>
                <br/><br/>

                <FormControl fullWidth="true">
                <InputLabel> Confirm Password </InputLabel>
                <Input fullWidth="true" type='password' inputRef={passRef} value={conf} onChange={event => setConf(event.target.value)}/>
                </FormControl>
                <br/><br/>

                <Button type="Submit" onClick={handleSignup} variant='outlinedPrimary'>Submit</Button>
                <p></p>
            </div>
            </Paper>
            </Grid>
        </Grid>
            </div>
        )
    } else if (login === 2){
        return <Category/>
    }else{
        return (
            <div>
                <div className={c.grow}>
                    <AppBar position="static">
                        <Toolbar>
                        <Link href="/" style={{color: 'white', textDecoration: 'none'}}>
                        <Typography className={c.title} variant="h6" noWrap>
                            Grapher-Mart
                        </Typography>
                        </Link>
                        <div className={c.grow} />
                        </Toolbar>
                    </AppBar>
                </div>
        <br/><br/>
        <Grid container spacing={0.5} >
        <Grid item xs={4} style={{marginLeft: "36vw"}}>
            <Paper className={classes.paper} style={{marginRight: '-1vw'}}>           
            <div className='login__form'>
                <Button color='primary' variant='contained' onClick={event => setLogin(0)}> Login </Button>
                <Button color='primary' id='signup' variant='contained' onClick={event => setLogin(1)}> Signup </Button>
                <br/><br/>
                { error1 && <h3 style={{color: '#ff0033'}}> { error1 } </h3> }
                {/* <h3 style={{color: '#ff0033'}}> Error: Me nhi chalunga! </h3> */}
                <FormControl fullWidth="true">
                <InputLabel>Email</InputLabel>
                <Input fullWidth="true" inputRef={emailRef}/>
                </FormControl>
                <br/> <br/>
                <FormControl fullWidth="true">
                    <InputLabel>Password (at least 6 characters)</InputLabel>
                    <Input fullWidth="true" type="password" inputRef={passRef}/>
                </FormControl>
                <br/> <br/>
                <Button type='submit' onClick={handleLogin} variant='outlinedPrimary'> Submit </Button>
                <br/><br/>
                <Button color='primary' variant='contained' href='/'> Back </Button>
            </div>
            </Paper>
            </Grid>
        </Grid>
            </div>
        )
    }
}
