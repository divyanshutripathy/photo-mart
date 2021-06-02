import React, {useRef, useState, useEffect} from 'react';
import { Button, FormControl, Input, InputLabel } from '@material-ui/core';
import './Photog_login.css';
import db, {auth} from '../../firebase';
import firebase from "firebase";
import Category from '../Category/Category';
// import { StateDropdown, RegionDropdown } from 'react-indian-state-region-selector';
import csc from 'country-state-city';
import Select from 'react-select';


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
    
    if (login === 1){ // Signup form
        return (
            <div className='login__form'>
                <br/><br/>
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
        )
    } else if (login === 2){
        return <Category/>
    }else{
        return (
            <div className='login__form'>
                <br/><br/>
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
        )
    }
}
