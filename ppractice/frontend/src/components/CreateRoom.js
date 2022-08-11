import React, { Component, useState, useEffect } from "react";

import Grid from '@mui/material/Grid';
import { FormHelperText, TextField, Typography } from "@mui/material";
import { FormControl } from "@mui/material";
import { RadioGroup } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from "@mui/material/Radio";
import { Button } from "@mui/material";
import { Link } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import Alert from "@mui/material/Alert";


const CreateRoom = (props) => {


    const defaultProps = {
        guest_can_pause: props.guest == false ? props.guest : true,
        votes_to_skip: props.votes ? props.votes : 2,
        isUpdate: props.update ? props.update : false,
        roomCode: props.code ? props.code : null,
        callbackFunction: () => { },
    }

    let navigate = useNavigate();

    const [guest_can_pause, setPause] = useState(defaultProps.guest_can_pause);
    const [votes_to_skip, setVotes] = useState(defaultProps.votes_to_skip);
    const [roomCode, setRoom] = useState(defaultProps.roomCode);
    const [callbackFunction, setCallback] = useState(defaultProps.callbackFunction);
    const [isUpdate, setUpdate] = useState(defaultProps.isUpdate);
    const [statusMy, setMyStatus] = useState("");


    const handleVotesChanged = (e) => {
        setVotes(e.target.value);
    }

    const handleGuestCanPauseChange = (e) => {
        setPause(e.target.value)
    }

    const handleCreateRoom = () => {
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: votes_to_skip,
                guest_can_pause: guest_can_pause
            })
        }

        fetch('django/create-room', requestOptions).then(
            (response) => response.json()
        ).then(
            (data) => {
                navigate('/room/' + data.code)
            }
        )
    }

    const updateRoom = () => {
        fetch('/django/update-room', {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: votes_to_skip,
                guest_can_pause: guest_can_pause,
                code: roomCode,
            }),
        })
            .then(response => {
                if (response.ok) {
                    setMyStatus("Updated!");

                } else {
                    console.log("error")
                    setMyStatus(response.msg);
                }
            })
    }

    // useEffect(() => {

    //     console.log("props.guest = ", props.guest)
    //     console.log("guest = ", guest_can_pause)
    // })

    return (
        <div>
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Collapse in={statusMy != ""}>
                        <Alert >{statusMy}</Alert>
                    </Collapse>
                </Grid >
                {!isUpdate ?
                    <Grid item xs={12} align="center">
                        <Typography component="h3" variant="h4">Create a Room</Typography>
                    </Grid >
                    :
                    <Grid item xs={12} align="center">
                        <Typography component="h4" variant="h3">Update {roomCode} Room</Typography>
                    </Grid >
                }

                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">
                                Guest Control of playback state
                            </div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={guest_can_pause} onChange={handleGuestCanPauseChange}>
                            <FormControlLabel value={true} control={<Radio color="primary" />} label="play & pause" labelPlacement="bottom"></FormControlLabel>
                            <FormControlLabel value={false} control={<Radio color="secondary" />} label="no control" labelPlacement="bottom"></FormControlLabel>
                        </RadioGroup>
                    </FormControl>
                </Grid >
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField required={true} type="number" onChange={handleVotesChanged} defaultValue={votes_to_skip} inputProps={{ min: 1, style: { textAlign: "center" }, }} />
                        <FormHelperText>
                            <div align="center">
                                Votes required to skip the song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                {!isUpdate ?
                    <Grid item xs={12} align="center">
                        <Button color="error" style={{ border: "1px solid red" }} variant="outlined" onClick={handleCreateRoom}>Create a room</Button>
                        <Button color="error" variant="contained" onClick={() => navigate('/')}>Back</Button>
                    </Grid>
                    :
                    <Grid item xs={12} align="center">
                        <Button color="error" variant="contained" onClick={updateRoom}>Update Room</Button>
                    </Grid>
                }

            </Grid>
        </div>
    );
}

export default CreateRoom;