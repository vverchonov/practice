import React, { Component, useState } from "react";

import { useParams } from "react-router-dom";

function Room() {
    const { roomCode } = useParams();
    const [votes_to_skip, setVotes] = useState(2);
    const [guest_can_pause, setPause] = useState(false);
    const [isHost, setIsHost] = useState(false);

    const getRoomDetails = () => {
        fetch('/django/get-room' + '?code=' + roomCode)
            .then(response => {
                return response.json()
            })
            .then(data => {
                setVotes(data.votes_to_skip);
                setPause(data.guest_can_pause);
                setIsHost(data.is_host);
            })
    }

    getRoomDetails()

    return (
        <div>
            <p>Votes:{votes_to_skip}</p>
            <p>Can Pause:{guest_can_pause.toString()}</p>
            <p>isHost?:{isHost.toString()}</p>
            <p>RoomCode:{roomCode}</p>
        </div>)

}



export default Room;