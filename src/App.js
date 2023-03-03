import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    photo: '',
    error: '',
    success: false
  });

  var googleProvider = new firebase.auth.GoogleAuthProvider();
  var provider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase.auth()
      .signInWithPopup(googleProvider)
      .then((result) => {
        const newUserInfo = { ...user, success: true, error: '' };
          setUser(newUserInfo);
          updateUserName(user.name);
          console.log(result);
      })
      .catch((error) => {
        const newUserInfo = { ...user, success: false, error: error.message };
        setUser(newUserInfo);
      })

  }
  const handleWithFacebook = () =>{
    firebase
  .auth()
  .signInWithPopup(provider)
  .then((result) => {
    const newUserInfo = { ...user, success: true, error: '' };
          setUser(newUserInfo);
          updateUserName(user.name);
          console.log(result);
  })
  .catch((error) => {
    const newUserInfo = { ...user, success: false, error: error.message };
    setUser(newUserInfo);
  });
    
  }
  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((result) => {
          const newUserInfo = { ...user, success: true, error: '' };
          setUser(newUserInfo);
          updateUserName(user.name);
          console.log(result);
        })
        .catch(error => {
          const newUserInfo = { ...user, success: false, error: error.message };
          setUser(newUserInfo);

        })
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((result) => {
          const newUserInfo = { ...user, success: true, error: '' };
          setUser(newUserInfo);
          console.log('signInWithEmailAndPassword', result.user);

        })
        .catch((error) => {
          const newUserInfo = { ...user, success: false, error: error.message };
          setUser(newUserInfo);
        });
    }
    e.preventDefault();

  }
  const handleChange = (event) => {
    let isFormValid = true;
    if (event.target.name === 'email') {
      var mail = /^\S+@\S+\.\S+$/;
      isFormValid = mail.test(event.target.value);

    }
    if (event.target.name === 'password') {
      const isPasswordValid = event.target.value.length >= 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFormValid = isPasswordValid && passwordHasNumber;
    }

    if (isFormValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const singOutUser = { isSignIn: false, name: '', email: '', photo: '' }
        setUser(singOutUser);
        console.log(res);
      })

  }
  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
      
    }).then(() => {
      console.log('User profile updated');
    }).catch((error) => {
      console.log(error);
    });  
  }
 
  return (
    <div className='App App-header'>
   
      <h1>Your Authintication</h1>
      <div className='form'>
      <div className='box'>

      <input type="checkbox" name='newUser' onChange={() => setNewUser(!newUser)} />
      <label for="newUser">New User Sign-Up</label>
      </div>
      <form  onSubmit={handleSubmit}>
        {
        newUser && 
        <div className='form-group'>
          <label for="exampleInputEmail1">Name</label>
          <input className='form-control' type="text" name='name' onBlur={handleChange} placeholder='Enter Your Name' />
        
        </div>}
    
        <div  className='form-group'>
        <label for="exampleInputEmail1">Email address</label>
        <input class='form-control' aria-describedby="emailHelp" type="text" name='email' onBlur={handleChange} placeholder='Enter Your Email' />

        </div>
        <div className='form-group'>
        <label for="exampleInputPassword1">Password</label>
        <input className='form-control' type="password" name='password' onBlur={handleChange} placeholder='Enter Your Password' />

        </div>

        <div>
          <br />
        <input class="btn btn-primary" type="submit" value={newUser ? 'Create Acount' : 'Log In'} />
        </div>
      
      </form>
      <br />
      <div>
      {
      user.isSignIn ?
        <button class="loginBtn loginBtn--google" onClick={handleSignOut}>Sign Out</button> :
        <button class="loginBtn loginBtn--google" onClick={handleSignIn}>Sign In With Google</button>
      }
      
      <button class="loginBtn loginBtn--facebook" onClick={handleWithFacebook}>Sign In With Facebook</button>
      </div>
      
      {
        user.error && <p style={{ color: 'red' }}>Email Already Register, Please Use New Email For Register! </p>
      }
      {
        user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged In'} Succesfully</p>
      }
      </div>

      
    </div>
    
  );
}

export default App;
