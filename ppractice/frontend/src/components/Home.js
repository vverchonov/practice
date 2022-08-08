import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateRoom from "./CreateRoom";
import RoomJoin from "./RoomJoin";
import Room from './Room'

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path='/' />
                    <Route path='/join' element={<RoomJoin />} />
                    <Route path='/create' element={<CreateRoom />} />
                    <Route path='/room/:roomCode' element={<Room />} />
                </Routes>
            </BrowserRouter>
        );
    }
}