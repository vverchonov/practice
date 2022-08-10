import { Menu } from '@mui/material';
import React, { Component } from 'react'
import { render } from 'react-dom'
import MyMenu from './MyMenu'
import Background from './Background';


export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div >

                <Background />
                <div id="center" style={{ backgroundColor: "#FFFFFF", paddingTop: "10%", paddingBottom: "10%", paddingLeft: "10px", paddingRight: "10px", border: "1px solid white", borderRadius: "30px", opacity: "0.9" }}>
                    <MyMenu />
                </div>

            </div >

        );
    }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);