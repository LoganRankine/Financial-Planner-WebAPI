import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CookiesProvider, useCookies } from "react-cookie";

import Account from "../src/Account.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";

//import { BrowserRouter as Route } from 'react-dom'
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App></App>
    </React.StrictMode>,
)

async function isAuthenticated() {
    if (document.cookie == '') {
        return false
        console.log("Cookie not found")
    }
    else {
        let sessionID = document.cookie.replace("SessionID=", "")
        let checkAuthStatus = await fetch(`https://localhost:7073/api/User/CheckAuthStatus?SessionId=${sessionID}`,
            {
                method: 'GET',
                mode: 'cors',
            }
        )
        if (checkAuthStatus.ok) {
            return true;
        }

        return false;
    }
    
}

    //< React.StrictMode >
    //<App />
    //</React.StrictMode >,
