import React, { Component, useState } from "react";
import { TextField, Button, Grid, Typography, ButtonGroup } from '@mui/material'
import { useNavigate } from 'react-router-dom';

function RoomJoin() {

    let navigate = useNavigate();

    const [roomCode, setCode] = useState('');
    const [error, setError] = useState('');


    const handleCodeChange = (e) => {
        setCode(e.target.value);
    }

    const backButton = () => {
        navigate('/');
    }

    const roomEnterButton = () => {
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: roomCode,
            })
        }

        fetch('django/join-room', requestOptions).then((response) => {
            if (response.ok) {
                console.log("ok")
                navigate('/room/' + roomCode)
            } else {
                setError("Room not found");
            }
        }).catch(error => {
            console.log(error)
        })
    }

    return (
        <div>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} align="center">
                    <Typography variant="h3" component="h4">Join a room</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField error={error} label="Code" placeholder="Enter a room code" value={roomCode} helperText={error} onChange={handleCodeChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="error" style={{ border: "1px solid red" }} variant="outlined" onClick={roomEnterButton} >Join</Button>
                        <Button color="error" variant="contained" onClick={backButton}>Go Back</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </div >)
}

export default RoomJoin;