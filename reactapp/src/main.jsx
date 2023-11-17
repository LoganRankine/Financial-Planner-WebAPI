import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import Account from "../src/Account.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";

//import { BrowserRouter as Route } from 'react-dom'
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/logan" element={<App />}>
                </Route>
                <Route path="/" element={<a href="/logan">homepage init</a>}>
                </Route>
                <Route path="/Account" element={<Account />}>
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)

    //< React.StrictMode >
    //<App />
    //</React.StrictMode >,
