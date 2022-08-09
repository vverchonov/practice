import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CreateRoom from "./CreateRoom";
import RoomJoin from "./RoomJoin";
import Room from './Room'
import MyHome from './MyHome'

// const navigate = useNavigate();

function MyMenu() {


    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MyHome />} />
                <Route path='/join' element={<RoomJoin />} />
                <Route path='/create' element={<CreateRoom />} />
                <Route path='/room/:roomCode' element={<Room />} />
            </Routes>
        </BrowserRouter>
    );

}


export default MyMenu;