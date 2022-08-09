import { Menu } from '@mui/material';
import React, { Component } from 'react'
import { render } from 'react-dom'
import MyMenu from './MyMenu'



export default class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="center">
                <MyMenu />
            </div>
        );
    }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);