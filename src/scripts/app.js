'use strict';

import { config } from './config.js';
firebase.initializeApp(config);

import * as validate from './validate.js';
import * as authenticate from './authenticate.js';
import * as post from './post.js';
import * as retrieve from './retrieve.js';

switch (location.pathname) {
  case '/pages/signup.html':
    validate.fName.oninput = validate.validateFName;
    validate.lName.oninput = validate.validateLName;
    validate.email.oninput = validate.validateEmail;
    validate.password.oninput = validate.validatePassword;
    validate.showHideEl.onclick = validate.showHide;
    validate.signupB.addEventListener('click', () => {
      authenticate.signUp(validate.validateSignupForm);
    });
    validate.fbLoginB.addEventListener('click', () => {
      authenticate.fbLogin();
    });
    break;

  case '/pages/login.html':
    validate.email.oninput = validate.validateEmail;
    validate.password.oninput = validate.validatePassword;
    validate.showHideEl.onclick = validate.showHide;
    validate.loginB.addEventListener('click', () => {
      authenticate.signIn(validate.validateLoginForm);
    });
    validate.fbLoginB.addEventListener('click', () => {
      authenticate.fbLogin();
    });
    break;

  case '/pages/reset-password.html':
    validate.email.oninput = validate.validateEmail;
    validate.passwordResetB.addEventListener('click', () => {
      authenticate.resetPassword(validate.validateEmail);
    });
    break;
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // console.log(user);

    switch (location.pathname) {
      case '/pages/signup.html':
        location.pathname = '/';
        break;

      case '/pages/login.html':
        location.pathname = '/';
        break;

      case '/pages/reset-password.html':
        location.pathname = '/';
        break;

      case '/' || '/index.html':
        validate.loginMenu.style.display = 'none';
        validate.userMenu.style.display = 'block';
        validate.userName.innerHTML = user.displayName;

        if (user.photoURL) {
          validate.profilePic.src = user.photoURL;
          validate.profilePic.setAttribute('class', 'rounded-circle');
        }
        break;
    }
  } else {
    // User is signed out.

    switch (location.pathname) {
      case '/pages/post.html':
        location.pathname = '/pages/login.html';
        break;

      case '/pages/my-ads.html':
        location.pathname = '/pages/login.html';
        break;

      case '/pages/favorites.html':
        location.pathname = '/pages/login.html';
        break;

      case '/' || '/index.html':
        validate.userMenu.style.display = 'none';
        validate.loginMenu.style.display = 'block';
        document
          .getElementById('start-selling')
          .setAttribute('href', './pages/login.html');
        break;
    }
  }
});

switch (location.pathname) {
  case '/' || '/index.html':
    window.onload = retrieve.retrieveData;
    retrieve.searchB.onclick = retrieve.searchAds;
    retrieve.searchCategory.onchange = retrieve.retrieveData;
    validate.logoutB.onclick = authenticate.logOut;
    break;

  case '/pages/post.html':
    $(document).ready(function() {
      bsCustomFileInput.init();
    });

    post.adCategory.onchange = post.catChange;
    post.postB.onclick = post.postAd;
    break;

  case '/pages/my-ads.html':
    window.onload = setTimeout(retrieve.myAds, 600);
    break;

  case '/pages/favorites.html':
    window.onload = setTimeout(retrieve.favorites, 600);
    break;
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      registration => {
        // Registration was successful
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope
        );
      },
      error => {
        // registration failed
        console.log('ServiceWorker registration failed: ', error);
      }
    );
  });
}
