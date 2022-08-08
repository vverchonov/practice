import React, { Component } from "react";

import Grid from '@mui/material/Grid';
import { FormHelperText, TextField, Typography } from "@mui/material";
import { FormControl } from "@mui/material";
import { RadioGroup } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from "@mui/material/Radio";
import { Button } from "@mui/material";
import { Link } from "@mui/material";


export default class CreateRoom extends Component {
    default_votes = 2

    constructor(props) {
        super(props);
        this.state = {
            guestCanPause: true,
            votesToSkip: this.default_votes
        }


        //this.handleCreateRoom = this.handleCreateRoom.bind(this);
    }

    handleVotesChanged = (e) => {
        this.setState({ votesToSkip: e.target.value })
    }

    handleGuestCanPauseChange = (e) => {
        this.setState({ guestCanPause: e.target.value === "true" ? true : false })
    }

    handleCreateRoom = () => {
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            })
        }

        fetch('django/create-room', requestOptions).then(
            (response) => response.json()
        ).then(
            (data) => { console.log("data = ", data) }
        )
    }

    render() {
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
                            <RadioGroup row defaultValue={true} onChange={this.handleGuestCanPauseChange}>
                                <FormControlLabel value={true} control={<Radio color="primary" />} label="play & pause" labelPlacement="bottom"></FormControlLabel>
                                <FormControlLabel value={false} control={<Radio color="secondary" />} label="no control" labelPlacement="bottom"></FormControlLabel>
                            </RadioGroup>
                        </FormControl>
                    </Grid >
                    <Grid item xs={12} align="center">
                        <FormControl>
                            <TextField required={true} type="number" onChange={this.handleVotesChanged} defaultValue={this.default_votes} inputProps={{ min: 1, style: { textAlign: "center" }, }} />
                            <FormHelperText>
                                <div align="center">
                                    Votes required to skip the song
                                </div>
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Button color="secondary" variant="contained" onClick={this.handleCreateRoom}>Create a room</Button>
                        <Button color="primary" variant="contained" to="/" component={Link}>Back</Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}