import React, { Component, useState } from "react";
import { useNavigate } from "react-router-dom"
import { Grid, Button, ButtonGroup, Typography, Link } from "@mui/material";
import { useEffect } from "react";


function MyHome() {
    let navigate = useNavigate();

    const [roomCode, setCode] = useState(null);

    const moveNextScreen = (link) => {
        navigate(link)
    }

    useEffect(() => {
        fetch('django/user-in-room')
            .then(response => response.json())
            .then(response => {
                setCode(response.code)
            })
    })



    return roomCode ? navigate('/room/' + roomCode) : (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">Home Block</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" onClick={() => moveNextScreen('join')}>Join Room</Button>
                        <Button color="secondary" onClick={() => moveNextScreen('create')}>Create Room</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </div>
    );
}

export default MyHome;