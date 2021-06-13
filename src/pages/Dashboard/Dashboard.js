import React, {useState, useEffect} from 'react';
import db, {auth, storage} from '../../firebase';
import './Dashboard.css';
import { Button, FormControl, Input, InputLabel, Checkbox, FormGroup, FormControlLabel, FormLabel, RadioGroup, Radio, Typography, AppBar, Toolbar, Fade, Link, Grid, Paper, Modal, Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import dpp from '../../dpp.png';
import csc from 'country-state-city';
import Select from 'react-select';
import { Save } from '@material-ui/icons';
import firebase from "firebase";
import Loader from "react-loader-spinner";
import {useStyles, useStyles0} from '../Photog_login/Photog_login';
import Messages from '../Messages/Messages';

const useStylesM = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

export default function Dashboard() {

    const clm = useStylesM();
    const c = useStyles0();
    const classes = useStyles();
    const [user, setUser] = useState({});
    const [data, setData] = useState({});
    const [photos, setPhotos] = useState([]);
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState("");
    const [no, setNo] = useState("");
    const [city, setCity] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [defaultState, setDefaultState] = useState(0);
    const [defaultCity, setdefaultCity] = useState(0);
    const [categories, setCategories] = useState({
        Wedding: false,
        Birthday: false, Anniversary: false, Bachelorette: false, Conference: false, Couples: false, 
        Couples: false,
        Family: false, Fashion: false, Graduation: false, Honeymoon: false, Instagram: false, Kids: false,
        Maternity: false, Newborn: false, Product: false, Property: false, Solo_Traveler: false, 
        Hair_Stylist: false, Folk: false, Drone: false
      })
    const [defaultCityList, setDefaultCityList] = useState([]);
    const [toDelete, setToDelete] = useState({});
    const [daaloPhoto, setDaaloPhoto] = useState([]);
    const [dp, setdp] = useState(0);
    const [profilePhoto, setProfilePhoto] = useState({});
    const [newProfile, setNewProfile] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openMessage, setOpenMessage] = useState(false);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((_user) => {
            if (_user){
                setUser(_user.uid);
                let uid = _user.uid
                db.collection('photographers').doc(uid).get().then(doc => {
                    if (doc.exists){
                        var data = doc.data();
                        console.log(data, user, "|| sjahfuhdsuhfusnhjohsjdhnjshnj----------------------");
                        setPhotos(data.photos);
                        logPhotos(data.photos);
                        setData(data);
                        setProfilePhoto(data.profile)
                        setCategories(data.categories);
                        getStates(data);
                        setIsLoading(false);
                    }else{
                        console.log("Nhi mila");
                    }
                });
            }else{
                window.location.href = "/photog_login";
            }
        })
        return unsubscribe;
    }, [])

    function logPhotos(pics){
        let pobj = {};
        for (let i = 0; i < pics.length; i++){
            pobj[pics[i].name] = false;
        }
        // console.log(pobj);
        setToDelete(pobj);
    }

    function getStates(datas){
        const nstates = csc.getStatesOfCountry("IN");
        const options = nstates.map((state) =>({
            'value': state.isoCode,
            'label': state.name
        }
        ))
        setStates(options);
        // console.log(datas);
        for (var i = 0; i < 37; i++){
            if (datas.State === nstates[i].name){
                setDefaultState(i);
                break;
            }
        }
        let cities = csc.getCitiesOfState("IN", nstates[i].isoCode);
        const cit_options = cities.map((cit) =>({
            'value': cit.stateCode,
            'label': cit.name
        }
        ))
        setCity(cit_options);
        setDefaultCityList(cit_options);
        for (var j = 0; j < cities.length; j++){
            if (datas.City === cities[j].name){
                setdefaultCity(j);
                break;
            }
        }
    }

    useEffect(() => {
        setName(data.Name);
        setNo(data.No);
        setSelectedCity(data.City);
        setSelectedState(data.State);
        // setCategories(data.categories);
        // console.log(categories, "maha chomu react");
    }, [edit])

    function editCat(event){
        event.preventDefault();
        setCategories(data.categories);
        setCity(defaultCityList);
        setdp(0);
        setEdit(true);
    }

    function handleSignOut(){
        auth.signOut();
    }

    function cityForState(event){
        setSelectedState(event.label);
        const cities = csc.getCitiesOfState("IN", event.value);
        // console.log(cities);
        const options = cities.map((cit) =>({
            'value': cit.stateCode,
            'label': cit.name
        }
        ))
        setCity(options);
    }

    // Ultimate Function To save Changes in the edit form
    function Save(event){
        event.preventDefault();
        setIsLoading(true);
        // console.log(name, no, selectedState, selectedCity);
        db.collection("photographers").doc(user).update({
            Name: name,
            No: no,
            State: selectedState,
            City: selectedCity,
            categories: categories
        }).then(
            () => deletePhotos(),
            (error) => console.log("Code phat gya: ", error)
        );
    }

    function newPhotos(){
        var arr = [];
        var imgNames = [];
        const promises = [];
        for (var i = 0; i < daaloPhoto.length; i++){
            let img = daaloPhoto[i];
            imgNames.push(img.name);
            let uploadTask = storage.ref(`/${user}/${img.name}`).put(img);
            promises.push(uploadTask);
            uploadTask.on("state_changed", console.log, console.error, () => {
            storage
              .ref(user)
              .child(img.name)
              .getDownloadURL()
              .then((url) => {
                arr.push(url);
              });
          });
          }
        Promise.allSettled(promises).then(tasks => {
            setTimeout(() => {
                console.log('all uploads complete');
                var urlUploads = [];
                for (var u = 0; u < daaloPhoto.length; u++){
                    urlUploads.push(db.collection("photographers").doc(user).update({
                        photos: firebase.firestore.FieldValue.arrayUnion({name: imgNames[u], url: arr[u]})
                    }))
                }
                Promise.allSettled(urlUploads).then(work =>{
                    if (dp === 1){
                        deleteProfile();
                    }else if (dp === 2){
                        uploadDP();
                    }else{
                        window.location.reload();
                    }
                })
            }, 3000)
        });
    }

    function deletePhotos(){
        // console.log(toDelete);
        // console.log(photos);
        var name_url = [];
        Object.entries(toDelete).map(([key, value]) => {
            if (value){
                for (let i = 0; i < photos.length; i++) {
                    if (key === photos[i].name){
                        name_url.push(db.collection("photographers").doc(user).update({
                            photos: firebase.firestore.FieldValue.arrayRemove(photos[i])
                        }))
                        name_url.push(storage.ref(`/${user}/${photos[i].name}`).delete())
                        break;
                    }
                }
            }
        })
        Promise.allSettled(name_url).then(work => {
            if (daaloPhoto.length){
                newPhotos();
            }else{
                if (dp === 1){
                    deleteProfile();
                }else if (dp === 2){
                    uploadDP();
                }else{
                    window.location.reload();
                }
            }
        })
    }

    // Function to delete profile photo
    function deleteProfile(){
        if (profilePhoto.url !== ""){
            db.collection("photographers").doc(user).update({
                profile: {url: "", name: ""}
            }).then(
                () => storage.ref(`/${user}/${profilePhoto.name}`).delete().then(() => {
                    window.location.reload();
                }),
                (error) => console.log("Code phat gya: ", error)
            )
        }else{
            window.location.reload();
        }
    }

    // Function to upload the new profile photo
    function uploadDP(){
        if (profilePhoto.url !== ""){
            storage.ref(`/${user}/${profilePhoto.name}`).delete().then(() => {
                let img = newProfile;
                var profile_name = img.name;
                let uploadTask = storage.ref(`/${user}/${img.name}`).put(img);
                uploadTask.on("state_changed", console.log, console.error, () => {
                storage
                    .ref(user)
                    .child(img.name)
                    .getDownloadURL()
                    .then((url) => {
                    var profile_url = url;
                    db.collection("photographers").doc(user).update({
                        profile: {url: profile_url, name: profile_name}
                    }).then(
                        () => window.location.reload(),
                        (error) => console.log("Code phat gya: ", error)
                    )
                    });
                });
            })
        }else{
            let img = newProfile;
            var profile_name = img.name;
            let uploadTask = storage.ref(`/${user}/${img.name}`).put(img);
            uploadTask.on("state_changed", console.log, console.error, () => {
            storage
                .ref(user)
                .child(img.name)
                .getDownloadURL()
                .then((url) => {
                var profile_url = url;
                db.collection("photographers").doc(user).update({
                    profile: {url: profile_url, name: profile_name}
                }).then(
                    () => window.location.reload(),
                    (error) => console.log("Code phat gya: ", error)
                )
                });
            });
        }
    }

    // Function to check if change profile radio button in selected in the edit form
    function handleProfileChange(event){
        let s = event.target.value;
        setdp(parseInt(s));
    }

    // To get the new profile photo and put it to state variable
    function uploadProfile(event){
        setNewProfile(event.target.files[0]);
    }

    const handleChange = (event) => {
        setCategories({ ...categories, [event.target.name]: event.target.checked });
    };

    const handlePhotoChange = (event) => {
        setToDelete({ ...toDelete, [event.target.name]: event.target.checked });
    }

    const uploadPhoto = (event) => {
        setDaaloPhoto(event.target.files);
    }

    const {Wedding, Birthday, Anniversary, Bachelorette, Conference, Couples, Family, Fashion, Graduation, Honeymoon, Instagram, Kids, Maternity, Newborn, Product, Property, Solo_Traveler, Hair_Stylist, Folk, Drone} = categories;

    if (isLoading){
        return(
        <Loader
            type="Grid"
            color="#00BFFF"
            height={100}
            width={100}
            visible={isLoading}
            style = {{marginTop: '20vh'}}
        />
        );
    }

    if(openMessage){
        return(
            <div>
                <div className={c.grow}>
                    <AppBar position="static">
                        <Toolbar>
                            <Link href="/" style={{color: 'white', textDecoration: 'none'}}>
                                <Typography className={c.title} variant="h6" noWrap>
                                    Grapher-Mart
                                </Typography>
                            </Link>
                            <Button variant='outlined' style={{color: 'white', backgroundColor: 'rgba(92, 107, 192, 1)', marginLeft: '81vw'}} onClick={e => setOpenMessage(false)}>Back</Button>
                        <div className={c.grow} />
                        </Toolbar>
                    </AppBar>
                </div>
                <br/>
                <Grid container spacing={0.5} > 
                    <Grid item xs={5} style={{marginLeft: '27vw'}}>
                        <Paper className={classes.paper} style={{minHeight: '78vh'}}>
                            <Messages uid={user}/>
                        </Paper>
                    </Grid>
                </Grid>

            </div>
        );
    }

    if (!edit){
        window.scrollTo(0, 0);
        return (
            <div>
                {/* Header Bar */}
                <div className={c.grow}>
                    <AppBar position="fixed">
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
                <br/>

            <Grid container spacing={0.5} style={{marginTop: "10vh"}}>
                <Grid item xs={11.2} style={{marginLeft: "1vw", marginRight: '1vw'}}>
                    <Paper className={classes.paper}>   
                <div style={{textAlign: "left"}}>
                    {/* DP Image */}
                    <div className="DP">
                        <img src={profilePhoto.url !== "" ? profilePhoto.url : dpp} alt="Loading..." height='180vh' width='200vw' style={{borderRadius: '50%'}} />
                        {/* <Avatar alt="Remy Sharp" src={data.profile} sizes="large" /> */}
                    </div>
        
                    {/* Name, email, no., city, & state */}
                    <div className="personal__info">
                        <h1>{data.Name}</h1>
                        <p>{data.Email}</p>
                        <p>{data.No}</p>
                        <p>{data.City}, {data.State}</p>
                    </div>
                        {/* <Messages uid={user}/> */}
        
                    {/* Edit and Logout Buttons */}
                    <div style={{ display: 'inline', marginLeft: '34vw', verticalAlign: 'top' }} >
                        <Button color='primary' variant='contained' style={{marginRight: "2vw"}} onClick={e => setOpenMessage(true)} > Messages </Button>
                        <Button color='primary' variant='contained' style={{marginRight: "2vw"}} onClick={editCat} > Edit </Button>
                        <Button color='primary' variant='outlinedPrimary' onClick={handleSignOut}> Logout </Button>
                    </div>
        
                    {/* Categories */}
                    <div className="name"><h2>Categories Selected: </h2></div>
                    <div className="categories">
                            {
                                Object.entries(categories).map(([key, value]) => {
                                    if (value){
                                        return (
                                            <div className="buttons">
                                                <Button variant='outlinedPrimary'>{key}</Button>
                                            </div>
                                        )
                                    }
                                })
                            }
                    </div>
                    
                    <div className="separator">
                        Your Photos
                    </div>
        
                    <br/>
        
                    <div>
                        {photos.map((tile) => (
                            <a href={tile.url} target="_blank"><img src={tile.url} alt="Loading..." height='200vh' width='270vw' className='photo' /></a>
                        ))}
                    </div>
        
                </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }else{
        return(
            <div>
                <div className={c.grow}>
                    <AppBar position="fixed">
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
                <Grid container spacing={0.5} style={{marginTop: "10vh"}}>
                <Grid item xs={11.2} style={{marginLeft: "1vw", marginRight: '1vw'}}>
                    <Paper className={classes.paper}> 
                <div className="edit__form">
                    <FormControl fullWidth="true">
                    <InputLabel>Full Name</InputLabel>
                    <Input fullWidth="true" value={name} onChange={event => setName(event.target.value)}/>
                    </FormControl>
                    <br/><br/>

                    <FormControl fullWidth="true">
                    <InputLabel>Work Phone No.</InputLabel>
                    <Input fullWidth="true" value={no} onChange={event => setNo(event.target.value)} inputProps={{maxlength: "10"}}/>
                    </FormControl>
                    <br/><br/>

                    {/* State Selector  */}
                    <Select options={states} placeholder='Select State' defaultValue={states[defaultState]} onChange={event => cityForState(event)} />
                    <br/>

                    {/* City Selector  */}
                    <Select options={city} placeholder='Select City' defaultValue={city[defaultCity]} onChange={event => setSelectedCity(event.label)} />
                    <br/>
                    <FormControl component="fieldset">
                    <FormLabel component="legend">Assign categories in which you are suitable: </FormLabel>
                    <FormGroup row>
                    <FormControlLabel
                    control={<Checkbox name="Wedding" checked={Wedding} onChange={handleChange} />}
                    label="Wedding"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Birthday" checked={Birthday} onChange={handleChange} />}
                    label="Birthday"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Anniversary" checked={Anniversary} onChange={handleChange} />}
                    label="Anniversary"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Bachelorette" checked={Bachelorette} onChange={handleChange} />}
                    label="Bachelorette"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Conference" checked={Conference} onChange={handleChange} />}
                    label="Conference"
                    />
                    </FormGroup>
                    <FormGroup row>
                    <FormControlLabel
                    control={<Checkbox name="Couples" checked={Couples} onChange={handleChange} />}
                    label="Couples"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Family" checked={Family} onChange={handleChange} />}
                    label="Family"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Fashion" checked={Fashion} onChange={handleChange} />}
                    label="Fashion"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Graduation" checked={Graduation} onChange={handleChange} />}
                    label="Graduation"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Honeymoon" checked={Honeymoon} onChange={handleChange} />}
                    label="Honeymoon"
                    />
                    </FormGroup>
                    <FormGroup row>
                    <FormControlLabel
                    control={<Checkbox name="Instagram" checked={Instagram} onChange={handleChange} />}
                    label="Instagram"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Kids" checked={Kids} onChange={handleChange} />}
                    label="Kids"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Maternity" checked={Maternity} onChange={handleChange} />}
                    label="Maternity"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Newborn" checked={Newborn} onChange={handleChange} />}
                    label="Newborn"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Product" checked={Product} onChange={handleChange} />}
                    label="Product"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Property" checked={Property} onChange={handleChange} />}
                    label="Property"
                    />
                    </FormGroup>
                    <FormGroup row>
                    <FormControlLabel
                    control={<Checkbox name="Solo_Traveler" checked={Solo_Traveler} onChange={handleChange} />}
                    label="Solo Traveler"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Hair_Stylist" checked={Hair_Stylist} onChange={handleChange} />}
                    label="Hair Stylist"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Folk" checked={Folk} onChange={handleChange} />}
                    label="Local Folk Costume"
                    />
                    <FormControlLabel
                    control={<Checkbox name="Drone" checked={Drone} onChange={handleChange} />}
                    label="Drone Photos/Videos"
                    />
                    </FormGroup>
                </FormControl>                
                </div>

                <br/>

                <div style={{textAlign:"left", marginLeft: '25vw'}}>
                    <FormLabel component="legend">Change Profile Photo: </FormLabel>
                    <br/>
                    <RadioGroup aria-label="profilePhoto" value={dp.toString()} name="profilePhoto" onChange={handleProfileChange}>
                        <FormControlLabel
                        control = {<Radio/>}
                        label = "Remove Profile Photo"
                        value = '1'
                        />
                        <FormControlLabel
                        control = {<Radio/>}
                        label = "New Profile Photo"
                        value = '2'
                        />
                    </RadioGroup>
                    <br/>
                </div>

                {
                    dp === 2 ? 
                    <div>
                        <br/>
                    <FormControlLabel
                    control={<Input type="file" id="uploadProfile" onChange={uploadProfile} accept="image/png, image/jpeg" name="image" />}
                    label="Upload Image"
                    /> 
                    <br/> <br/> 
                    </div> : <p></p>
                }

                <div className="separator">
                        Select Photos To Delete
                </div>

                <br/>

                <div style={{textAlign: "left", marginLeft: '7vw'}}>
                    {photos.map((tile) => (
                        // <a href={tile} target="_blank">
                        //     <img src={tile} alt="nhi chal rha" height='200vh' width='280vw' className='photo' />
                        // </a>
                        <FormControlLabel
                        control={<Checkbox name={tile.name} onChange={handlePhotoChange} />}
                        label={<img src={tile.url} alt="nhi chal rha" height='200vh' width='280vw' className='photo'/>}
                        />
                    ))}
                    {/* <FormControlLabel
                    control={<Checkbox name="imageTest" />}
                    label={<img src="http://townandcountryremovals.com/wp-content/uploads/2013/10/firefox-logo-200x200.png" alt="nhi chal rha" height='200vh' width='280vw' className='photo' />}
                    /> */}
                </div>
                <div className="separator">
                    Upload More Photos
                </div>
                <br/>
                <FormControlLabel
                control={<Input type="file" id="uploadImage" onChange={uploadPhoto} accept="image/png, image/jpeg" name="image" inputProps={{ multiple: true }} />}
                label="Upload Image"
                />
                <br/><br/><br/>
                <div>
                    <Button variant="contained" color="primary" style={{marginRight: '3vw'}} onClick={Save}> Save Changes </Button>
                    <Button onClick={event => setEdit(false)} variant="outlinedPrimary"> Cancel </Button>
                </div>
                <br/><br/><br/><br/>
                </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}
