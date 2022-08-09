import React, { Component, useState } from "react";

import Grid from '@mui/material/Grid';
import { FormHelperText, TextField, Typography } from "@mui/material";
import { FormControl } from "@mui/material";
import { RadioGroup } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from "@mui/material/Radio";
import { Button } from "@mui/material";
import { Link } from "@mui/material";
import { useNavigate } from 'react-router-dom';



function CreateRoom() {
    let navigate = useNavigate();
    let default_votes = 2;
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         guestCanPause: true,
    //         votesToSkip: this.default_votes
    //     }


    //     this.handleCreateRoom = this.handleCreateRoom.bind(this);
    // }
    const [guest_can_pause, setPause] = useState(true);
    const [votes_to_skip, setVotes] = useState(default_votes);

    const handleVotesChanged = (e) => {
        setVotes(e.target.value);
    }

    const handleGuestCanPauseChange = (e) => {
        setPause(e.target.value === "true" ? true : false)
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


    return (
        <div>
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">Create a Room</Typography>
                </Grid >
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">
                                Guest Control of playback state
                            </div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={true} onChange={handleGuestCanPauseChange}>
                            <FormControlLabel value={true} control={<Radio color="primary" />} label="play & pause" labelPlacement="bottom"></FormControlLabel>
                            <FormControlLabel value={false} control={<Radio color="secondary" />} label="no control" labelPlacement="bottom"></FormControlLabel>
                        </RadioGroup>
                    </FormControl>
                </Grid >
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField required={true} type="number" onChange={handleVotesChanged} defaultValue={default_votes} inputProps={{ min: 1, style: { textAlign: "center" }, }} />
                        <FormHelperText>
                            <div align="center">
                                Votes required to skip the song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" onClick={handleCreateRoom}>Create a room</Button>
                    <Button color="primary" variant="contained" onClick={() => navigate('/')}>Back</Button>
                </Grid>
            </Grid>
        </div>
    );

}

export default CreateRoom;