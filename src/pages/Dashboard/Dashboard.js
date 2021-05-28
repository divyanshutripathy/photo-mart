import React, {useState, useEffect} from 'react';
import db, {auth} from '../../firebase';
import './Dashboard.css';
import { Button, GridList, GridListTile } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import dpp from '../../dpp.png';

export default function Dashboard() {

    const [user, setUser] = useState({});
    const [data, setData] = useState({});
    const [cate, setCate] = useState({});
    const [photos, setPhotos] = useState([]);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((_user) => {
            if (_user){
                setUser(_user.uid);
                let uid = _user.uid
                db.collection('photographers').doc(uid).get().then(doc => {
                    if (doc.exists){
                        var data = doc.data();
                        console.log(data);
                        setCate(data.categories);
                        setPhotos(data.photos);
                        setData(data);
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

    function handleSignOut(){
        auth.signOut();
    }

    const useStyles = makeStyles((theme) => ({
        root: {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
        },
        gridList: {
          width: 500,
          height: 450,
        },
      }));

    const classes = useStyles();

    if (!edit){
        return (
            <div style={{textAlign: "left"}}>
                
                {/* DP Image */}
                <div className="DP">
                    <img src={data.profile ? data.profile : dpp} alt="Could not fetch picture" height='180vh' width='200vw' style={{borderRadius: '50%'}} />
                    {/* <Avatar alt="Remy Sharp" src={data.profile} sizes="large" /> */}
                </div>
    
                {/* Name, email, no., city, & state */}
                <div className="personal__info">
                    <h1>{data.Name}</h1>
                    <p>{data.Email}</p>
                    <p>{data.No}</p>
                    <p>{data.City}, {data.State}</p>
                </div>
    
                {/* Edit and Logout Buttons */}
                <div style={{ display: 'inline', marginLeft: '45vw', verticalAlign: 'top' }} >
                    <Button color='primary' variant='contained' style={{marginRight: "2vw"}} > Edit </Button>
                    <Button color='primary' variant='outlinedPrimary' onClick={handleSignOut}> Logout </Button>
                </div>
    
                {/* Categories */}
                <div className="name"><h2>Categories Selected: </h2></div>
                <div className="categories">
                        {
                            Object.entries(cate).map(([key, value]) => {
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
                        <a href={tile} target="_blank"><img src={tile} alt="nhi chal rha" height='200vh' width='280vw' className='photo' /></a>
                    ))}
                </div>
    
            </div>
        )
    }else{
        return(
            <div>
                Sahi hai!
            </div>
        )
    }
}
