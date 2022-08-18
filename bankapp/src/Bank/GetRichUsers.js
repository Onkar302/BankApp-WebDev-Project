import axios from "axios";
import React , { useState, useEffect }from "react";

const baseURL = "http://127.0.0.1:5555/api/v1/admin/getRichUsers";

export default function GetRichUsers() {
  const [msg, updateMsg] = useState("");
  var isAdmin = ""
  var errMsg = ""
  const [post, setPost] = useState([]);
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

  React.useEffect(() => {
    
    validate()
    axios.get(`${baseURL}` ,{
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    }).then((response) => {
      setPost(response.data);
    }).catch((err) => errMsg=err);
  }, [ ]);

  
  if (msg == "Not Authorized") {
    return (<>
        <h1>LOGIN AGAIN</h1>
    </>)
}

  
  return (
    <div>

        <h1>Rich Users</h1>
        

        <table className="table table-bordered table-dark table-hover">
                <thead>
                    <tr>
                    <th scope="col">UserName</th>
                    <th scope="col">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    post.map((users , index) =>  <tr key={index}>
                   
                    <td>{users.username}</td>
                    <td>{users.balance}</td>
                    </tr>
                    )  
                    
                    
                    }
                    
                </tbody>
                </table>
                
    </div>
  );
}