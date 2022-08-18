import { useState, useEffect } from "react"
import axios from "axios"

export function DeleteUser() {

    const [msg, updateMsg] = useState("")
    const [username, updateUsername] = useState("")
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







    function deleteUser(e) {
        e.preventDefault()


        axios.delete("http://127.0.0.1:5555/api/v1/admin/delete", {
            data: {

                username: username
            },
            headers: { 'Authorization': `Bearer ${jwtToken}` }

        }).then((resp) => updateMsg(resp.data))
            .catch((err) => updateMsg(err.response.data))
    }








    function usernameChangeHandler(e) {
        updateUsername(e.target.value)
    }

    useEffect(() => {
        validate()
    }, [])

    if (msg == "Not Authorized") {
        return (<>
            <h1>LOGIN AGAIN</h1>
        </>)
    }
    return (
        <>
            <h4>Delete User</h4>
            <br></br>

            <form style={{border: "2px solid black",borderRadius: "5px", width:"35%", justifyContent: "center", padding:"1%"}} onSubmit={deleteUser}>
                Enter username: <input type="text" value={username} onChange={usernameChangeHandler} required />
                <br></br>

                <input className="btn btn-primary" type="submit" />
            </form>

            <br></br>
            <h4>{msg}</h4>
        </>

    )
}