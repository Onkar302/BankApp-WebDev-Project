import { useEffect, useState } from "react"
import axios from "axios"

export function NumberOfAccounts(){

    const [accounts, updateCount] = useState(0)
    const [msg, updateMsg] = useState("")
    var isAdmin = ""

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
            isAdmin = resp.data.isAdmin;
            console.log(isAdmin)
            if (isAdmin == "False" || isAdmin == "") {
                updateMsg("Not Authorized")
                return
            }

        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    };

   
    
    function getAccountCount(){
        axios.get("http://127.0.0.1:5555/api/v1/numberOfAccounts", {
            headers: { 'Authorization': `Bearer ${jwtToken}` }
        }).then((resp) => updateCount(resp.data))
        .catch((err) => console.log(err))
    }
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
        <h1>Total number of accounts in the bank at the current moment : {accounts}</h1>
        <br></br>
        <center><button className="btn btn-primary" type="button" onClick={getAccountCount}>Get fresh accounts count</button></center>
        
        </>
        
    )
}