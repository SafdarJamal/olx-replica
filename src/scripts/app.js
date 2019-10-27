'use strict';

import * as validate from './validate.js';
import * as authenticate from './authenticate.js';
import * as post from './post.js';
import * as retrieve from './retrieve.js';

if (location.pathname === '/pages/signup.html') {
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
} else if (location.pathname === '/pages/login.html') {
  validate.email.oninput = validate.validateEmail;
  validate.password.oninput = validate.validatePassword;
  validate.showHideEl.onclick = validate.showHide;
  validate.loginB.addEventListener('click', () => {
    authenticate.signIn(validate.validateLoginForm);
  });
  validate.fbLoginB.addEventListener('click', () => {
    authenticate.fbLogin();
  });
} else if (location.pathname === '/pages/reset-password.html') {
  validate.email.oninput = validate.validateEmail;
  validate.passwordResetB.addEventListener('click', () => {
    authenticate.resetPassword(validate.validateEmail);
  });
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // console.log(user);

    if (location.pathname === '/pages/signup.html') {
      location.pathname = '/';
    } else if (location.pathname === '/pages/login.html') {
      location.pathname = '/';
    } else if (location.pathname === '/pages/reset-password.html') {
      location.pathname = '/';
    } else if (
      location.pathname === '/' ||
      location.pathname === '/index.html'
    ) {
      validate.loginMenu.style.display = 'none';
      validate.userMenu.style.display = 'block';
      validate.userName.innerHTML = user.displayName;

      if (user.photoURL) {
        validate.profilePic.src = user.photoURL;
        validate.profilePic.setAttribute('class', 'rounded-circle');
      }
    }
  } else {
    // User is signed out.

    if (location.pathname === '/pages/post.html') {
      location.pathname = '/pages/login.html';
    } else if (location.pathname === '/pages/my-ads.html') {
      location.pathname = '/pages/login.html';
    } else if (location.pathname === '/pages/favorites.html') {
      location.pathname = '/pages/login.html';
    } else if (
      location.pathname === '/' ||
      location.pathname === '/index.html'
    ) {
      validate.userMenu.style.display = 'none';
      validate.loginMenu.style.display = 'block';
      document
        .getElementById('start-selling')
        .setAttribute('href', './pages/login.html');
    }
  }
});

if (location.pathname === '/' || location.pathname === '/index.html') {
  window.onload = retrieve.retrieveData;

  retrieve.searchCategory.onchange = retrieve.retrieveData;
  retrieve.searchInput.onsearch = retrieve.searchAds;

  validate.logoutB.onclick = authenticate.logOut;
} else if (location.pathname === '/pages/post.html') {
  $(document).ready(function() {
    bsCustomFileInput.init();
  });

  post.adCategory.onchange = post.catChange;
  post.postB.onclick = post.postAd;
} else if (location.pathname === '/pages/my-ads.html') {
  window.onload = setTimeout(retrieve.myAds, 900);
} else if (location.pathname === '/pages/favorites.html') {
  window.onload = setTimeout(retrieve.favorites, 900);
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
