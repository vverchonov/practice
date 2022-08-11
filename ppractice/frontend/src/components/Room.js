import React, { Component, useEffect, useState } from "react";

import { Grid, Typography, Button, Modal, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CreateRoom from "./CreateRoom";
import { ButtonGroup } from "@mui/material";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Room() {
    const { roomCode } = useParams();
    const [votes_to_skip, setVotes] = useState(2);
    const [guest_can_pause, setPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [open, setOpen] = useState(false);
    const [isSpotify, setSpotify] = useState(false);

    const navigation = useNavigate();

    const getRoomDetails = () => {
        fetch('/django/get-room' + '?code=' + roomCode)
            .then(response => {
                return response.json()
            })
            .then(data => {
                setVotes(data.votes_to_skip);
                setPause(data.guest_can_pause);
                setIsHost(data.is_host);
                authenticateSpotify()
            })
    }

    const leaveRoom = () => {
        fetch('/django/leave-room', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => {
                if (response.ok) {
                    navigation('/');
                }
            })
    }

    const handleModal = () => {
        if (open)
            setOpen(false);
        else
            setOpen(true);
    }

    useEffect(() => {
        getRoomDetails()

    })

    const authenticateSpotify = () => {
        fetch('/spotify/is-auth')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (!data.msg) {
                    fetch('/spotify/auth-url')
                        .then(response => response.json())
                        .then(data => {
                            window.location.replace(data.url)
                        })
                }
            })

    }

    const ModalRender = () => {
        return (
            <Modal
                open={open}
                onClose={handleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CreateRoom code={roomCode} votes={votes_to_skip} guest={guest_can_pause} update={true} func />
                </Box>
            </Modal>
        );
    }

    return (
        <div>
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">Room Code: {roomCode}</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">Can you pause?: {guest_can_pause.toString()}</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">Are you admin?: {isHost.toString()}</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">Votes to skip: {votes_to_skip}</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        {isHost ?

                            <Button color="error" style={{ border: "1px solid red" }} variant="outlined" onClick={handleModal}>Settings</Button>
                            : null
                        }
                        <Button color="error" variant="contained" onClick={leaveRoom}>Leave Room</Button>
                    </ButtonGroup>
                </Grid>
                <ModalRender />
            </Grid>
        </div>
    );

}



export default Room;

{/* <div>
<p>Votes:{votes_to_skip}</p>
<p>Can Pause:{guest_can_pause.toString()}</p>
<p>isHost?:{isHost.toString()}</p>
<p>RoomCode:{roomCode}</p>
</div>) */}