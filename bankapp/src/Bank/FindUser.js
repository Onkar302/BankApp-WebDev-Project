import { useState, useEffect } from "react";
import axios from "axios";

export default function FindUser() {

  const [username, updateUsername] = useState("");

  const [userData, userState] = useState({})
  const [msg, updateMsg] = useState("");
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

  function usernameChangeHandler(event) {
    let new_username = { ...username };
    console.log(new_username);
    new_username = event.target.value;
    updateUsername(new_username);
  }

  function findUserHandler(event) {
    let getUrl = "http://127.0.0.1:5555/api/v1/findUser/" + username;

    axios({
      method: "get",
      url: getUrl,
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    })
    .then((response) => userState(response.data))

    .catch((errResponse) => console.log(errResponse));
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
    <div>
      <label>Enter Username:{" "}</label>
      
      <input style={{margin:"1%"}}
        type="text" 
        value={username}
        onChange={usernameChangeHandler}
      />
      <br></br>
      <br></br>
      <button style={{margin:"1%"}} className="btn btn-primary" onClick={findUserHandler}>Done</button>
      <br></br>
      <br></br>
      <h1>Username: {" "} {userData.username}</h1>
      <h1>Balance: {" "} {userData.balance}</h1>
      <h1>isAdmin: {" "} {userData.isAdmin}</h1>
    </div>
  );
}
