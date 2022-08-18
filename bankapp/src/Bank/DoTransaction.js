import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Transaction() {
  
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

  
  const [transaction, doTransaction] = useState({
    amount: 0,
    transactionType: "",
  });

  function amountChangeHandler(event) {
    let new_transaction = { ...transaction };
    console.log(new_transaction);
    new_transaction.amount = event.target.value;
    doTransaction(new_transaction);
  }

  function transactionTypeChangeHandler(event) {
    let new_transaction = { ...transaction };
    console.log(new_transaction);
    if (event.target.value == "W" || event.target.value == "D") {
      new_transaction.transactionType = event.target.value;
      doTransaction(new_transaction);
    }
  }

  function completeTransactionHandler(event) {
    console.log(username)
    let postUrl = "http://127.0.0.1:5555/api/v1/doTransaction/" + username;

    axios({
      method: "put",
      url: postUrl,
      data: {
        amount: transaction.amount,
        transactionType: transaction.transactionType,
      },
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    })
      .then((response) => updateMsg(response.data))
      .catch((errResponse) => updateMsg(errResponse.response.data));
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
      <label>Enter amount :{" "}</label>
      
      <input style={{margin:"1%"}}
        type="text"
        value={transaction.amount}
        onChange={amountChangeHandler}
      />
      <br></br>
      <br></br>
      <label>Enter Transaction Type (D/W) :{" "}</label>
      <input style={{margin:"1%"}}
        type="text"
        value={transaction.transactionType}
        onChange={transactionTypeChangeHandler}
      />
      <br></br>
      <br></br>
      <button style={{margin:"1%"}} className="btn btn-primary" onClick={completeTransactionHandler}>Done</button>
      <br></br>
      <br></br>
      <h4>{msg}</h4>
    </div>
  );
}
