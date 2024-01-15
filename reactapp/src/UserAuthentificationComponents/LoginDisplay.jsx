import React, { Children, Component, useState, useEffect } from 'react';
import '../css/Account.css'
import '../css/AccountHomepage.css'
import { CookiesProvider, useCookies } from "react-cookie";
import Dropdown from 'react-bootstrap/Dropdown';
import serverConfig from "../../server-config.json"

function LoginDisplay() {
    const [cookies, setCookie, removeCookie] = useCookies(['SessionID']);
    const [username, setUsername] = useState(null);

    const logout = async (event) => {
        removeCookie("SessionID", { path: "/" })
        console.log("logged out")
        window.location.href = "/"
    }

    useEffect(() => {
        let sessionId = cookies.SessionID

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", sessionId)
        fetch(`https://${serverConfig.serverIP}:${serverConfig.serverPort}/api/User/GetUsername`,
            {
                method: 'GET',
                mode: 'cors',
                headers: myHeaders,
            }
        ).then(response => response.json()).then(data => {
            console.log(data)
            setUsername(data)
        });
    }, []);

    return (
        <div className="login-display-content">
            <Dropdown>
                <Dropdown.Toggle variant="success">
                    {!username ? 'Loading' : username}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}
export default LoginDisplay