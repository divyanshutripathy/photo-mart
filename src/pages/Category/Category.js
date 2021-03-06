import React, {useState, useEffect} from 'react';
import db, {auth, storage} from '../../firebase';
import { Button, Input, Checkbox, FormControl, FormGroup, FormControlLabel, FormLabel, AppBar, Toolbar, Link, Typography, Grid, Paper } from '@material-ui/core';
import Loader from "react-loader-spinner";
import {useStyles, useStyles0} from '../Photog_login/Photog_login';
import logo from '../../logo8.png';

export default function Category() {
  const classes = useStyles();
  const c = useStyles0();
    const [user, setUser] = useState("");
    const [photos, setPhotos] = useState([])
    const [data, setData] = useState([])
    const [file, setFile] = useState([]);
    const [profile, setProfile] = useState([]);
    const [categories, setCategories] = useState({
      Wedding: false,
      Birthday: false, Anniversary: false, Bachelorette: false, Conference: false, Couples: false, 
      Couples: false,
      Family: false, Fashion: false, Graduation: false, Honeymoon: false, Instagram: false, Kids: false,
      Maternity: false, Newborn: false, Product: false, Property: false, Solo_Traveler: false, 
      Hair_Stylist: false, Folk: false, Drone: false
    })
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      let photog = "";
      const unsubscribe = auth.onAuthStateChanged((_user) => {
        photog = _user.uid; 
        setUser(_user.uid);
      });

        setTimeout(() => {
        console.log(photog);
        db.collection("photographers").doc(photog)
        .get().then((doc) => {
          if (doc.exists){
            console.log(doc.data());
            setData([...data, doc.data()]);
          } else {
            console.log("No such document!");
          }}).catch((error) => {
            console.log("Error getting document:", error);
          });
        }, 2000)
        return unsubscribe;
      }, []);
      
      const handleChange = (event) => {
        setCategories({ ...categories, [event.target.name]: event.target.checked });
      };

      const logData = (event) => {
        setIsLoading(true);
        db.collection("photographers").doc(user).update({
          categories: categories
        }).then(
          () => cloudStorage(),
          (error) => console.log("Code phat gya: ", error)
        );
      }

      function handleFileChange(e) {
        setFile(e.target.files);
        console.log('files');
      }

      function handleProfileChange(e){
        setProfile(e.target.files[0]);
      }

      const profileStorage = () => {

      }

      const cloudStorage = () => {
        var arr = [];
        var imgNames = [];
        const promises = [];

        var profile_name = '';
        var profile_url = '';
        if (profile.length !== 0){
          let img = profile;
          profile_name = img.name;
          let uploadTask = storage.ref(`/${user}/${img.name}`).put(img);
            promises.push(uploadTask);
            uploadTask.on("state_changed", console.log, console.error, () => {
            storage
              .ref(user)
              .child(img.name)
              .getDownloadURL()
              .then((url) => {
                console.log(url);
                profile_url = url;
                console.log(arr, "after");
              });
          });
        }

        for (var i = 0; i < file.length; i++){
          let img = file[i];
          imgNames.push(img.name);
          let uploadTask = storage.ref(`/${user}/${img.name}`).put(img);
          promises.push(uploadTask);
          uploadTask.on("state_changed", console.log, console.error, () => {
          storage
            .ref(user)
            .child(img.name)
            .getDownloadURL()
            .then((url) => {
              console.log(url);
              arr.push(url);
              setPhotos(arr);
              console.log(arr, "after");
            });
        });
        }
        Promise.allSettled(promises).then(tasks => {
          setTimeout(() => {
          console.log('all uploads complete');
          var name_urls = [];
          for (var u = 0; u < file.length; u++){
            name_urls.push({name: imgNames[u], url: arr[u]})
          }
          db.collection("photographers").doc(user).update({
            photos: name_urls,
            profile: {url: profile_url, name: profile_name}
          }).then(
            () => window.location.href = "/dashboard",
            (error) => console.log("Code phat gya: ", error)
          )
        }, 3000)
        });
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

    return (
        <div>
          <div className={c.grow}>
              <AppBar position="static">
                  <Toolbar>
                  <Link href="/" style={{color: 'white', textDecoration: 'none'}}>
                  <Typography className={c.title} variant="h6" noWrap>
                    <img src={logo} alt='Not working' height='60'/>
                  </Typography>
                  </Link>
                  <div className={c.grow} />
                  </Toolbar>
              </AppBar>
          </div>
          
          <br/><br/>
          {console.log(photos, 'lol')}
          <Grid container spacing={0.5} >
            <Grid item xs={8} style={{marginLeft: "20vw"}}>
                <Paper className={classes.paper} style={{marginRight: '-1vw'}}>  
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
            <br/>
            {/* <p>{data[data.length-1].Name} {data[data.length-1].Email}</p> */}
            {/* {console.log(data)} */}
            <br/>
            {/* <input type="file" id="uploadZip" name="icon" multiple/> */}
            <FormLabel component="legend" style={{textAlign:'left', marginLeft: '24vw'}}>Upload Your Profile Picture: </FormLabel>
            <br/>
            <FormControlLabel
            control={<Input type="file" id="uploadImage" onChange={handleProfileChange} accept="image/png, image/jpeg" name="image"/>}
            label="Upload Picture"
            />
            <br/><br/>
            <FormLabel component="legend" style={{textAlign:'left', marginLeft: '24vw'}}>Upload Your Sample Photographs: </FormLabel>
            <br/>
            <FormControlLabel
            control={<Input type="file" id="uploadImage" onChange={handleFileChange} accept="image/png, image/jpeg" name="image" inputProps={{ multiple: true }} />}
            label="Upload Image"
            />
            <br/><br/>
            <Button onClick={logData} variant="outlinedPrimary">Submit</Button>
            {/* <Button onClick={cloudStorage} variant="outlinedPrimary">Image Upload</Button> */}
            </Paper>
            </Grid></Grid>
        </div>
    )
}

