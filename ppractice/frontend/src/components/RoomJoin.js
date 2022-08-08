import React, { Component, useState } from "react";
import { TextField, Button, Grid, Typography, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom';

function RoomJoin() {

    let navigate = useNavigate();

    const [roomCode, setCode] = useState('');
    const [error, setError] = useState('');


    const handleCodeChange = (e) => {
        setCode(e.target.value);
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
                <Grid item xs={12}>
                    <Typography variant="h4" component="h4">Join a room</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField error={error} label="Code" placeholder="Enter a room code" value={roomCode} helperText={error} onChange={handleCodeChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={roomEnterButton} >Join</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>Go Back</Button>

                </Grid>

            </Grid>
        </div >)
}

export default RoomJoin;