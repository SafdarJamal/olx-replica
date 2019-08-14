'use strict';

import {
  fName,
  lName,
  email,
  password,
  signupB,
  loginB,
  passwordResetB,
  authError
} from './validate.js';

// Firebase Authentication Methods

function signUp(validateForm) {
  authError.style.display = 'none';

  if (!validateForm()) {
    return false;
  }

  if (signupB.classList.contains('disabled')) {
    return false;
  } else {
    signupB.className += ' disabled';
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(email.value, password.value)
    .then(success => {
      const user = success.user;
      // console.log(user);
      user
        .updateProfile({
          displayName: `${fName.value} ${lName.value}`
        })
        .catch(error => {
          console.log(error);
        });
      const userData = {
        firstName: fName.value,
        lastName: lName.value,
        displayName: `${fName.value} ${lName.value}`,
        email: user.email,
        providerId: user.providerData[0].providerId,
        providerSpecificUId: user.providerData[0].uid
      };
      firebase
        .database()
        .ref(`users/${user.uid}`)
        .set(userData, error => {
          if (error) {
            console.log(error);
          } else {
            // Data saved successfully!
            location.pathname = '/';
          }
        });
    })
    .catch(error => {
      // Handle Errors here.
      // const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);

      authError.style.display = 'block';
      signupB.className = 'btn btn-info btn-lg btn-block';
    });
}

function signIn(validateForm) {
  authError.style.display = 'none';

  if (!validateForm()) {
    return false;
  }

  if (loginB.classList.contains('disabled')) {
    return false;
  } else {
    loginB.className += ' disabled';
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then(success => {
      // console.log(success.user);
      location.pathname = '/';
    })
    .catch(error => {
      // Handle Errors here.
      // var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);

      authError.style.display = 'block';
      loginB.className = 'btn btn-info btn-lg btn-block';
    });
}

function fbLogin() {
  const provider = new firebase.auth.FacebookAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(result => {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      // const token = result.credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      firebase
        .database()
        .ref(`users/${user.uid}`)
        .set(user.providerData[0], error => {
          if (error) {
            console.log(error);
          } else {
            console.log('Success');
            location.pathname = '/';
          }
        });
    })
    .catch(error => {
      // Handle Errors here.
      // const errorCode = error.code;
      const errorMessage = error.message;
      // The firebase.auth.AuthCredential type that was used.
      // const credential = error.credential;
      console.log(errorMessage);
    });
}

function resetPassword(validateEmail) {
  if (!validateEmail()) {
    return false;
  }

  if (passwordResetB.classList.contains('disabled')) {
    return false;
  } else {
    passwordResetB.className += ' disabled';
  }

  firebase
    .auth()
    .sendPasswordResetEmail(email.value)
    .then(() => {
      alert('Password reset link has been sent to your email.');
      passwordResetB.className = 'btn btn-info btn-lg btn-block';
    })
    .catch(error => {
      alert(error.message);
      passwordResetB.className = 'btn btn-info btn-lg btn-block';
    });
}

function logOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      location.pathname = '/pages/login.html';
    })
    .catch(error => {
      console.log(error);
    });
}

export { signUp, signIn, fbLogin, resetPassword, logOut };
