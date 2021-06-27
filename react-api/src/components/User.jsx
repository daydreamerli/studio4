import React, {useState, useEffect} from "react";
import Axios from "axios";
import './styles.css'


function User() {
  let apiUrl = "http://localhost:5000/users/";
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [authorList, setItems] = useState([]);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [_id, setId] = useState('')
  const [isSent, setIsSent] = useState(false)

  const [readPostId, writePostId] = useState("");
  const deleteAuthor = async () => {
    try {
      await Axios.delete(`${apiUrl}/${readPostId}`);
      console.log("Author is successfully deleted");
    } catch (err){
      console.log("Author deletion failed");
    }
  };
  
  //adding authors 
    const submit = () => {
      console.log(name,email);
      fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ name, email }),
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => response.json()) 
      .then(json => console.log(json));
    }
  
    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
      fetch(apiUrl)
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setItems(result);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }, [])
  
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } 
      return (
        <section>
          <aside>
            <h3>User List</h3>
            <ul>
              {authorList.map(users => (
                <div className="list">
                  <h5>User ID: {users._id}</h5>
                  <p>Name: {users.name}</p>
                  <p>Email: {users.email}</p>
                  <hr className="rounded"></hr>
                  </div>
                ))}
            </ul>
          </aside>
          
          <article>
            <h3>Create User</h3>
            <form onSubmit={submit}>
              <label>Name:</label>
              <input type="text" name="name" value={name} onChange={e => setName(e.target.value)}/><br/>
              <label>Email:</label>
              <input type="text" name="email" value={email} onChange={e => setEmail(e.target.value)}/><br/>
              <input type="submit" name="Submit" />
            </form><br></br>

            <h3>Delete User</h3>
            <form onSubmit={deleteAuthor}>
              <label>User ID: </label>
              <input type="text" name="_id" value={readPostId} onChange={e => writePostId(e.target.value)}/><br/>
              <input type="submit" name="Delete" value="Delete"/>
            </form>
          </article>
      </section>
    );

}
export default User;