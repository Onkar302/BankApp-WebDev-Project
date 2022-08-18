import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Transfer() {

  const [msg, updateMsg] = useState("");

  const [transfer, doTransfer] = useState({
    to_username: "",
    amount: 0
  });
  const[username, updateUsername] = useState("")
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

  function amountChangeHandler(event) {
    let new_transaction = { ...transfer };
    console.log(new_transaction);
    new_transaction.amount = event.target.value;
    doTransfer(new_transaction);
  }

  function toUsernameChangeHandler(event) {
    let new_transaction = { ...transfer };
    console.log(new_transaction);
    new_transaction.to_username = event.target.value;
    doTransfer(new_transaction);
  }

  function completeTransactionHandler() {
    let postUrl = "http://127.0.0.1:5555/api/v1/transfer/" + username;
console.log(transfer.to_username)
console.log(transfer.amount)
console.log(username)

    axios({
      method: "post",
      url: postUrl,
      data: {
        // username: transfer.username,
        amount: transfer.amount,
        to_username: transfer.to_username,
      },
      headers: { 'Authorization': `Bearer ${jwtToken}` }

    }).then((response) => updateMsg(response.data))
    .catch((errResponse) => updateMsg(errResponse.data));
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
      <h1>Hello {username}</h1>
      <br></br>
      <br></br>
      <label>Enter amount:{" "}</label>
      
      <input style={{margin:"1%"}}
        type="text"
        value={transfer.amount}
        onChange={amountChangeHandler}
      />
      <br></br>
      <br></br>
      <label>Enter Recepient Username:{" "}</label>
      
      <input style={{margin:"1%"}}
        type="text"
        value={transfer.to_username}
        onChange={toUsernameChangeHandler}
      />
      <br></br>
      <br></br>
      <button style={{marginLeft:"1%"}} className="btn btn-primary" onClick={completeTransactionHandler}>Done</button>

      <br></br>
      <br></br>
      <h4>{msg}</h4>
    </div>
  );
}
