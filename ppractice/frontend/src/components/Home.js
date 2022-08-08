import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateRoom from "./CreateRoom";
import RoomJoin from "./RoomJoin";
import Room from './Room'
import { Grid, Button, ButtonGroup, Typography, Link } from "@mui/material";

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    renderHome() {

        return (
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={12} align="center">
                        <Typography variant="h3" compact="h3">Home Block</Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <ButtonGroup disableElevation variant="contained" color="primary">
                            <Button color="primary" to="join" component={Link}>Join Room</Button>
                            <Button color="secondary" to="create" component={Link}>Create Room</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </div>
        );
    }

    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={this.renderHome()} />
                    <Route path='/join' element={<RoomJoin />} />
                    <Route path='/create' element={<CreateRoom />} />
                    <Route path='/room/:roomCode' element={<Room />} />
                </Routes>
            </BrowserRouter>
        );
    }
}