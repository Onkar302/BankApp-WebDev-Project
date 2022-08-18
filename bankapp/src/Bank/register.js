import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Register() {

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

  const [registration, updateRegistration] = useState({
    username: "",
    password: "",
    amount: 100,
    isAdmin: 'False'
  });

  function usernameChangeHandler(event) {
    let new_transaction = { ...registration };
    console.log(new_transaction);
    new_transaction.username = event.target.value;
    updateRegistration(new_transaction);
  }

  function passwordChangeHandler(event) {
    let new_transaction = { ...registration };
    console.log(new_transaction);
    new_transaction.password = event.target.value;
    updateRegistration(new_transaction);
  }

  function completeTransactionHandler(event) {
    let postUrl = "http://127.0.0.1:5555/api/v1/register";

    axios({
      method: "post",
      url: postUrl,
      data: {
        username: registration.username,
        password: registration.password,
        balance: registration.amount,
        isAdmin: registration.isAdmin,
      },
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    })
      .then((response) => updateMsg(response.data))
      .catch((errResponse) => updateMsg(errResponse));
  }

  useEffect(() => {
    validate()
}, [])

if (msg == "Not Authorized") {
    return (<>
        <a href="/"><h1>LOGIN AGAIN</h1></a>
    </>)
}

  return (
    <div>
      {/* <h1>Hello {username}</h1> */}

      
      <label>Enter Username:{" "}</label>
      <input style={{margin:"1%"}}
        type="text"
        value={registration.to_username}
        onChange={usernameChangeHandler} required />
      <br></br>
      <br></br>
      <label>Enter Password:{" "}</label>
      
      <input style={{margin:"1%"}}
        type="text"
        value={registration.to_username}
        onChange={passwordChangeHandler} required />
      <br></br>
      <br></br>
      
      <button style={{marginLeft:"1%"}} className="btn btn-primary" onClick={completeTransactionHandler}>Register</button>
      <br></br>
      <br></br>
      <h4>{msg}</h4>
    </div>
  );
}
