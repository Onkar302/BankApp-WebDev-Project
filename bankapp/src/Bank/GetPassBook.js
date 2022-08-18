import axios from "axios";
import React , { useState, useEffect }from "react";
import { useParams } from "react-router-dom";


export default function GetPassBook() {

  const [post, setPost] = useState([]);
  const[username, updateUsername] = useState("")
  const [msg, updateMsg] = useState("");
  var name = ""

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
        name = resp.data.username
       await passbookFetch()
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};
  
 

  

  async function passbookFetch(){
    console.log(name)
    const baseURL = "http://127.0.0.1:5555/api/v1/getPassbook/" + name;
    await axios.get(`${baseURL}`,{
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    } ).then((response) => {
      console.log(response.data)
      setPost(response.data);
    })
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

        <h1>Passbook for {username}</h1>
        

        <table className="table table-bordered table-dark table-hover">
                <thead>
                    <tr>
                    <th scope="col">Amount</th>
                    <th scope="col">User</th>
                    <th scope="col">Transaction Type</th>
                    <th scope="col">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    post.map((transaction , index) =>  <tr key={index}>
                   
                    <td>{transaction.amount}</td>
                    <td>{transaction.username}</td>
                    <td>{transaction.transactionType}</td>
                    <td>{transaction.date}</td>
                    </tr>
                    )  
                    }
                    
                </tbody>
                </table>
                <br></br>
                {/* <button style={{margin:"1%"}} className="btn btn-primary" onClick={passbookFetch}>Fetch passbook details</button> */}
    </div>
  );
}