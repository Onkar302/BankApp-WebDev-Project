import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
export function LandingPage(){


    let navigate = useNavigate()
    const [user, updateUser] = useState({username:"", password:"", status:false})
    const [username, setUsername] = useState("")
    const [admin, setAdmin] = useState("")


    function usernameChangeHandler(e){
        let new_user = {...user}
        new_user.username = e.target.value
        updateUser(new_user) 
    }

    function updateStatus(newStatus){
        let new_user = {...user}
        new_user.status = newStatus
        updateUser(new_user)
    }

    function passwordChangeHandler(e){
        let new_user = {...user}
        new_user.password = e.target.value
        updateUser(new_user) 
    }
    function postDataHandler(e){
        e.preventDefault()
        const getJWTToken = async () => {
        try {
            const resp = await  axios.post("http://127.0.0.1:5555/api/v1/login",{
         
                username: user.username,
                password: user.password
            
          })
          await jwtInfo(resp.data)
          
            }
            
         catch (err) {
            // Handle Error Here
            console.error(err);
        }
    }
        getJWTToken()

        
        if(admin == "True"){
            navigate('/admin/home')
        }
        else if(admin == "False"){
            navigate("/home")
        }
        
    }

    async function jwtInfo(access_token){

        try {
            const resp = await  axios("http://127.0.0.1:5555/jwtInfo",{
                method:"post",
                headers: {'Authorization': `Bearer ${access_token}`}
    
            })
            setData(resp.data)
            }
            
         catch (err) {
            // Handle Error Here
            console.error(err);
        }

        localStorage.clear()
        localStorage.setItem('jwt_token', access_token)
    }

    function setData(data){
        setAdmin(data.isAdmin)
        setUsername(data.username)
        
    }



    return (<div >
        <h4 className="display-3 text-center" style={{margin:"1%"}}>Signup</h4>
        <center>
        <form onSubmit={postDataHandler} style={{border: "2px solid black",borderRadius: "5px", width:"35%", justifyContent: "center", padding:"1%"}}>
            <label>Enter username : </label>
            <input style={{marginLeft:"1%"}} type="text" value={user.username} onChange={usernameChangeHandler} required />
            <br></br>
            <br></br>
            <label>Enter password:</label>
             <input style={{marginLeft:"1%"}} type="text" value = {user.password} onChange={passwordChangeHandler} required/>
            <br></br>
            <br></br>
            <input style={{marginLeft:"1%", width:"100%"}} className="btn btn-primary" type="submit"/>
            </form>
        </center>
        

            <br></br>
            <br></br>
            
    </div>)
}