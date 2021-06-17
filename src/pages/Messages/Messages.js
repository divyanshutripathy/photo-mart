import React, { useEffect, useState, useRef, forwardRef } from 'react';
import db from '../../firebase';
import firebase from 'firebase';
import {Button, Input, Grid, Paper, Card, CardContent, Typography, Link} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import './Messages.css';
import FlipMove from 'react-flip-move';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {useStyles} from '../Photog_login/Photog_login';

const Message = forwardRef(({message, photog}, ref) => {
    return (
        <div className="messageCard" ref={ref}>
            <Card className={!photog ? "userCard" : "couserCard"}>
                <CardContent>
                    <Typography color="white" variant="outlined" component="subtitile1">
                        {/* The below line makes the user's own texts appear without a username */}
                    {message.message}
                    </Typography>
                    {/* <Typography color="white" variant="caption" style={{marginTop: '-6vh'}}>
                    {message.timestamp.toDate().getHours()}
                    </Typography> */}
                </CardContent>
            </Card>
        </div>
    )
})

export default function Messages({uid}) {
    const classes = useStyles();
    const [ids, setIds] = useState([]);
    const [messId, setMessId] = useState("");
    const [names, setNames] = useState([]);
    const [chat, setChat] = useState([]);
    const [type, setType] = useState("")

    useEffect(() => {
        let arr = [];
        let nrr = []
        console.log(uid);
        db.collection('messages').where('photog', '==', uid).get()
        .then(docs => {
            docs.forEach(doc => {
                // db.collection('customers').doc(doc.data().customer).get().then(
                //     item => {
                //         nrr.push(item.data().Name)
                //         // setNames([...names, item.data().Name])
                //         setNames(nrr);
                //     }
                // )
                nrr.push(doc.data().cName);
                arr.push(doc.id);
            })
            setNames(nrr);
            setIds(arr);
            console.log(names);
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }, [])



    function getChats(docid){
        console.log("yaha aya");
        db.collection('messages').doc(docid).collection('chat').orderBy('timestamp').onSnapshot(
            snapshot =>{
            setChat(snapshot.docs.map(doc => (
                ({id: doc.id, message: doc.data()})
            )))
            }
        )
    }

    function toChats(index){
        getChats(ids[index]);
        setMessId(ids[index]);
    }

    function sendMessage(){
        console.log(messId, type);
        db.collection('messages').doc(messId).collection('chat').add(
            {message: type, photog: true, timestamp: firebase.firestore.FieldValue.serverTimestamp()}
        )
        setType('');
    }

    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef} />;
    };

    if(messId !== ""){
        return(
            <div>
                <div align="left">
                    <Link onClick={e => setMessId("")} style={{ fontSize: 5 }}> <ArrowBackIosIcon/></Link>
                </div>
                <div className="messages">
                <FlipMove className="message">
                    {chat.map(({id, message}) => (
                        <div align={message.photog ? "right" : "left"}>
                        <Message message={message} photog={message.photog} key={id} />
                        <AlwaysScrollToBottom />
                        </div>
                    ))}
                </FlipMove>
                </div>
                <div className='send'>
                    <Input placeholder='Type your message' style={{width: '31vw'}} onChange={e => setType(e.target.value)} value={type}></Input>
                    <Button style={{marginLeft: '0.7vw'}} onClick={sendMessage} disabled={!type}><SendIcon style={{color: 'blue'}}/></Button>
                </div>
            </div>
        );
    }


    return (
        <div>
            <div clasName="head">
                <h2>
                    Messages
                </h2>
                <hr/>
            </div>
            <div className='message__box' align='center'>
            
                {
                    names.map((data, index) => (
                        <Card style={{backgroundColor: 'seashell', marginBottom: '2vh', width: '35vw'}}>
                            <CardContent>
                                <Link className='ln' onClick={e => toChats(index)} style={{color: 'black', textDecoration: 'none', onHover: 'cursor'}}>
                                <Typography color="white" variant="outlined" component="h3">
                                    {data}
                                </Typography>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
            {/* <Button variant="outlinedPrimary" style={{width: '25vw', marginBottom: '3vh'}} onClick={e => toChats(index)}> {data} </Button> */}
        </div>
    )
}
