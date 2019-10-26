'use strict';

let adCategory = document.getElementById('ad-category');
let title = document.getElementById('title');
let description = document.getElementById('description');
let price = document.getElementById('price');
let photo = document.getElementById('photo');
let postB = document.getElementById('post-button');

function validatePost() {
  const regex = /^[A-Za-z0-9.-_#'*+/;$&:"@%,-?(!)]?([\ ]?[A-Za-z0-9.-_#*+/;$&:@%,-?(!)])+$/;

  if (adCategory.value === 'CHOOSE A CATEGORY') {
    alert('Category is requird !');
    return false;
  } else if (!title.value.match(regex)) {
    alert('Title is requird !');
    return false;
  } else if (!description.value.match(regex)) {
    alert('Description is requird !');
    return false;
  } else if (!price.value.match('^[0-9]+$')) {
    alert('Price is requird !');
    return false;
  } else if (photo.value === '') {
    alert('Photo is requird !');
    return false;
  } else {
    return true;
  }
}

function postAd() {
  if (!validatePost()) {
    return false;
  }

  var ad = {
    adCategory: adCategory.value,
    title: title.value,
    description: description.value,
    price: price.value,
    photo: photo.files[0].name
  };

  if (postB.classList.contains('disabled')) {
    return false;
  }
  postB.className += ' disabled';

  const storage = firebase.storage();
  const storageRef = storage.ref(`ad_Photos/${ad.photo}`);

  storageRef.put(photo.files[0]).then(() => {
    storageRef
      .getDownloadURL()
      .then(url => {
        ad.photoURL = url;
        // console.log(ad);

        const key = firebase
          .database()
          .ref(`users/${firebase.auth().currentUser.uid}/myAds/`)
          .push(ad, error => {
            if (error) {
              // The write failed...
              console.log(error);
            } else {
              // Data saved successfully!
              console.log('My Ad Successfully Posted');
            }
          }).key;

        ad.key = key;
      })
      .then(() => {
        firebase
          .database()
          .ref(`ads/${ad.adCategory}/${ad.key}`)
          .set(ad, error => {
            if (error) {
              // The write failed...
              console.log(error);
            } else {
              // Data saved successfully!
              console.log('Successfully Posted');
              location.pathname = '/';
            }
          });
      })
      .catch(error => {
        console.log(error);
        postB.className = 'btn btn-info btn-lg btn-block';
      });
  });
}

export { adCategory, title, description, price, photo, postB };
export { postAd };
