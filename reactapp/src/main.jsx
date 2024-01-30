import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './css/index.css'
import { CookiesProvider, useCookies } from "react-cookie";

import Account from "../src/Account.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";

//import { BrowserRouter as Route } from 'react-dom'
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App></App>
    </React.StrictMode>,
)

    //< React.StrictMode >
    //<App />
    //</React.StrictMode >,
