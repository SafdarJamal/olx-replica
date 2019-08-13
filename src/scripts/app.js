'use strict';

import * as validate from './validate.js';
import * as authenticate from './authenticate.js';
import * as post from './post.js';
import * as retrieve from './retrieve.js';

import { config } from './config.js';
firebase.initializeApp(config);

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
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    if (location.pathname === '/' || location.pathname === '/index.html') {
      validate.loginMenu.style.display = 'none';
      validate.userMenu.style.display = 'block';
      validate.userName.innerHTML = user.displayName;
      if (user.photoURL) {
        validate.profilePic.src = user.photoURL;
        validate.profilePic.setAttribute('class', 'rounded-circle');
      }
    }
    // console.log(user);
    console.log('Already logged in');
  } else {
    // User is signed out.
    if (location.pathname === '/pages/post.html') {
      location.replace('http://localhost:8080/pages/login.html');
    } else if (location.pathname === '/pages/profile.html') {
      location.replace('http://localhost:8080/pages/login.html');
    } else if (location.pathname === '/pages/my-ads.html') {
      location.replace('http://localhost:8080/pages/login.html');
    } else if (location.pathname === '/pages/favorites.html') {
      location.replace('http://localhost:8080/pages/login.html');
    } else if (location.pathname === '/pages/setting.html') {
      location.replace('http://localhost:8080/pages/login.html');
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
    console.log('Logged out');
  }
});

if (location.pathname === '/' || location.pathname === '/index.html') {
  window.onload = retrieve.retrieveData;
  retrieve.searchB.onclick = retrieve.searchAds;
  retrieve.searchCategory.onchange = retrieve.retrieveData;
  validate.logoutB.onclick = authenticate.logOut;
} else if (location.pathname === '/pages/post.html') {
  $(document).ready(function() {
    bsCustomFileInput.init();
  });

  post.adCategory.onchange = post.catChange;
  post.postB.onclick = post.postAd;
} else if (location.pathname === '/pages/my-ads.html') {
  window.onload = setTimeout(retrieve.myAds, 600);
} else if (location.pathname === '/pages/favorites.html') {
  window.onload = setTimeout(retrieve.favorites, 600);
}

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then(
//       registration => {
//         // Registration was successful
//         console.log(
//           'ServiceWorker registration successful with scope: ',
//           registration.scope
//         );
//       },
//       error => {
//         // registration failed :(
//         console.log('ServiceWorker registration failed: ', error);
//       }
//     );
//   });
// }

// if (navigator.onLine) {
//     alert("Online");
// } else {
//     alert("Offline");
// }

// let appBtn = document.getElementById('app');
// let deferredPrompt;
// window.addEventListener('beforeinstallprompt', event => {
//   // Prevent Chrome 67 and earlier from automatically showing the prompt
//   // event.preventDefault();
//   // Stash the event so it can be triggered later.
//   deferredPrompt = event;
//   if (location.pathname === '/' || location.pathname === '/index.html') {
//     appBtn.addEventListener('click', e => {
//       appBtn.className = 'd-none';
//       deferredPrompt.prompt();
//       deferredPrompt.userChoice.then(choiceResult => {
//         if (choiceResult.outcome === 'accepted') {
//           console.log('User accepted the A2HS prompt');
//         } else {
//           console.log('User dismissed the A2HS prompt');
//           appBtn.className = 'btn btn-primary ml-3 position-fixed';
//         }
//         deferredPrompt = null;
//       });
//     });
//   }
// });

// window.addEventListener("appinstalled", e => {
//     // console.log(e);
// });

// if (window.matchMedia('(display-mode: standalone)').matches) {
//   console.log('display-mode is standalone');
//   if (location.pathname === '/' || location.pathname === '/index.html') {
//     appBtn.className = 'd-none';
//   }
// } else if (!window.matchMedia('(display-mode: standalone)').matches) {
//   console.log('display-mode is not standalone');
//   if (location.pathname === '/' || location.pathname === '/index.html') {
//     appBtn.className = 'btn btn-primary ml-3 position-fixed';
//   }
// }

// Notification.requestPermission(status => {
//   console.log('Notification permission status:', status);
// });

// function displayNotification() {
//   if (Notification.permission === 'granted') {
//     navigator.serviceWorker.getRegistration().then(reg => {
//       const options = {
//         body: 'Here is a notification body!',
//         icon: '../images/favicons/android-chrome-192x192.png',
//         vibrate: [100, 50, 100],
//         data: {
//           dateOfArrival: Date.now(),
//           primaryKey: 1
//         },
//         actions: [
//           {
//             action: 'explore',
//             title: 'Explore this new world',
//             icon: '../images/icons/navigation.png'
//           },
//           {
//             action: 'close',
//             title: 'Close notification',
//             icon: '../images/icons/cancel.png'
//           }
//         ]
//       };
//       reg.showNotification('Hello world!', options);
//     });
//   } else if (Notification.permission == 'denied') {
//     alert('Allow push notifications first.');
//     let res =
//       'Notifications permission has been blocked as the user has dismissed the permission prompt several times.\nThis can be reset in Page Info which can be accessed by clicking the lock icon next to the URL.';
//   }
// }

// let notify = document.getElementById('notify');
// notify.onclick = displayNotification;
