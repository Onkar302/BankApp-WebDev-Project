import bankImg from './bank.jpg'
import { useState, useEffect } from "react";
import axios from "axios";
export default function Home(){

    const[username, updateUsername] = useState("")
  const [msg, updateMsg] = useState("");

  const jwtToken = localStorage.getItem('jwt_token')

  const validate = async () => {
    try {
        if (jwtToken == null) {
            updateMsg("Not Authorized")
            return
        }
        const resp = await axios("http://127.0.0.1:5555/jwtInfo", {
            method: "post",
            headers: { 'Authorization': `Bearer ${jwtToken}` }

        });
       updateUsername(resp.data.username);

    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

useEffect(() => {
    validate()
}, [])

if (msg == "Not Authorized") {
    return (<>
        <h1>LOGIN AGAIN</h1>
    </>)
}


    return(
        <>
        
        <h1 className=" display-2 text-center">Welcome to the bank {username}</h1>
        <br></br>
        <br></br>

        <center><img src={bankImg}></img></center>
        
        </>
    )
}