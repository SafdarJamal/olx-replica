'use strict';

let searchCategory = document.getElementById('search-category');
let searchV = document.getElementById('search-input');
let searchB = document.getElementById('search-btn');

function retrieveData() {
  let field = searchCategory.value;

  switch (field) {
    case 'all':
      field = 'ads/';
      break;
    default:
      field = `ads/${searchCategory.value}/`;
      break;
  }

  console.log(field);

  firebase
    .database()
    .ref(field)
    .on(
      'value',
      snapshot => {
        const data = snapshot.val();
        console.log(data);

        if (searchCategory.value === 'all') {
          const values = Object.values(data);
          // console.log(values);

          const arr = [];
          let mainDiv = document.getElementById('data-box');
          mainDiv.innerHTML = '';
          values.forEach(inObj => {
            let exArr = Object.values(inObj);
            exArr.forEach(gotObj => {
              arr.push(gotObj);
            });
          });
          arr.forEach(obj => {
            const card = document.createElement('div');
            card.setAttribute('class', 'card shadow rounded mb-5 col-md-6');
            const cardContent = `<img src="${
              obj.photoURL
            }" class="card-img-top">
                                    <div class="card-body">
                                        <h4 class="card-title mb-3">Rs ${
                                          obj.price
                                        }</h4>
                                        <h5 class="card-subtitle mb-3">${
                                          obj.title
                                        }</h5>
                                        <p class="card-text">${
                                          obj.description
                                        }</p>
                                        <button type="button" id="${
                                          obj.key
                                        }" class="btn btn-outline-info">Save for later</button>
                                    </div>`;
            card.innerHTML = cardContent;
            mainDiv.append(card);
            let btn = document.getElementById(obj.key);
            btn.addEventListener('click', () => {
              saveAd(obj, btn);
            });
          });
        } else {
          const keys = Object.keys(data);
          let mainDiv = document.getElementById('data-box');
          mainDiv.innerHTML = '';
          keys.forEach(key => {
            // console.log(data[key]);
            let obj = data[key];
            const card = document.createElement('div');
            card.setAttribute('class', 'card shadow rounded mb-5 col-md-6');
            const cardContent = `<img src="${
              obj.photoURL
            }" class="card-img-top">
                                    <div class="card-body">
                                        <h4 class="card-title mb-3">Rs ${
                                          obj.price
                                        }</h4>
                                        <h5 class="card-subtitle mb-3">${
                                          obj.title
                                        }</h5>
                                        <p class="card-text">${
                                          obj.description
                                        }</p>
                                        <button type="button" id="${
                                          obj.key
                                        }" class="btn btn-outline-info">Save for later</button>
                                    </div>`;
            card.innerHTML = cardContent;
            mainDiv.append(card);
            let btn = document.getElementById(obj.key);
            btn.addEventListener('click', () => {
              saveAd(obj, btn);
            });
          });
        }
      },
      error => {
        console.log(error);
        let mainDiv = document.getElementById('data-box');
        mainDiv.className += ' display-4';
        mainDiv.textContent = 'Refresh this page to sea ads.';
      }
    );
}

function myAds() {
  firebase
    .database()
    .ref(`users/${firebase.auth().currentUser.uid}/myAds/`)
    .on(
      'value',
      snapshot => {
        const data = snapshot.val();
        let mainDiv = document.getElementById('data-box');
        if (!data) {
          mainDiv.className += ' display-4';
          mainDiv.textContent = 'You dont have any ads.';
          return false;
        }
        mainDiv.innerHTML = '';
        const keys = Object.keys(data);
        keys.forEach(key => {
          // console.log(data[key]);
          let obj = data[key];
          const card = document.createElement('div');
          card.setAttribute('class', 'card shadow rounded mb-5 col-md-6');
          const cardContent = `<img src="${obj.photoURL}" class="card-img-top">
                                <div class="card-body">
                                    <h4 class="card-title mb-3">Rs ${
                                      obj.price
                                    }</h4>
                                    <h5 class="card-subtitle mb-3">${
                                      obj.title
                                    }</h5>
                                    <p class="card-text">${obj.description}</p>
                                    <button type="button" id="${key}" class="btn btn-outline-danger">Delete</button>
                                </div>`;
          card.innerHTML = cardContent;
          mainDiv.append(card);
          let btn = document.getElementById(key);
          btn.addEventListener('click', () => {
            deleteMyAd(obj, key);
          });
        });
      },
      error => {
        console.log(error);
        let mainDiv = document.getElementById('data-box');
        mainDiv.className += ' display-4';
        mainDiv.textContent = 'Refresh this page to sea ads.';
      }
    );
}

function saveAd(ad, btn) {
  if (!firebase.auth().currentUser) {
    alert('Login first to save this ad !');
    return false;
  }
  if (btn.textContent === 'Save for later') {
    btn.textContent = 'Saved';
  } else if ((btn.textContent = 'Saved')) {
    alert('Already saved.');
    return false;
  }
  firebase
    .database()
    .ref(`users/${firebase.auth().currentUser.uid}/favorites/${ad.key}`)
    .set(ad, error => {
      if (error) {
        // The write failed...
        console.log(error);
      } else {
        // Data saved successfully!
        console.log('Ad Successfully Saved');
      }
    });
}

function searchAds() {
  const field = searchV.value;
  switch (field) {
    case '':
      return false;
    case ' ':
      return false;
    case '  ':
      return false;
    case '   ':
      return false;
  }
  firebase
    .database()
    .ref('ads/')
    .on(
      'value',
      snapshot => {
        const data = snapshot.val();
        const values = Object.values(data);
        const arr = [];
        let mainDiv = document.getElementById('data-box');
        mainDiv.innerHTML = '';
        values.forEach(inObj => {
          let exArr = Object.values(inObj);
          exArr.forEach(gotObj => {
            arr.push(gotObj);
          });
        });
        arr.forEach(obj => {
          if (field.toLowerCase() === obj.title.toLowerCase()) {
            const card = document.createElement('div');
            card.setAttribute('class', 'card shadow rounded mb-5 col-md-6');
            const cardContent = `<img src="${
              obj.photoURL
            }" class="card-img-top">
                                    <div class="card-body">
                                        <h4 class="card-title mb-3">Rs ${
                                          obj.price
                                        }</h4>
                                        <h5 class="card-subtitle mb-3">${
                                          obj.title
                                        }</h5>
                                        <p class="card-text">${
                                          obj.description
                                        }</p>
                                        <button type="button" id="${
                                          obj.key
                                        }" class="btn btn-outline-info">Save for later</button>
                                    </div>`;
            card.innerHTML = cardContent;
            mainDiv.append(card);
            let btn = document.getElementById(obj.key);
            btn.addEventListener('click', () => {
              saveAd(obj, btn);
            });
          }
        });
        if (mainDiv.textContent === '') {
          mainDiv.textContent = 'Not found.';
          mainDiv.className += ' display-3 mb-5';
        } else {
          mainDiv.className = 'container';
        }
      },
      error => {
        console.log(error);
      }
    );
}

function favorites() {
  firebase
    .database()
    .ref(`users/${firebase.auth().currentUser.uid}/favorites/`)
    .on(
      'value',
      snapshot => {
        const data = snapshot.val();
        let mainDiv = document.getElementById('data-box');
        mainDiv.innerHTML = '';
        if (!data) {
          mainDiv.className += ' display-4';
          mainDiv.textContent = 'You dont have any ads.';
          return false;
        }
        const keys = Object.keys(data);
        keys.forEach(key => {
          // console.log(data[key]);
          let obj = data[key];
          const card = document.createElement('div');
          card.setAttribute('class', 'card shadow rounded mb-5 col-md-6');
          const cardContent = `<img src="${obj.photoURL}" class="card-img-top">
                                <div class="card-body">
                                    <h4 class="card-title mb-3">Rs ${
                                      obj.price
                                    }</h4>
                                    <h5 class="card-subtitle mb-3">${
                                      obj.title
                                    }</h5>
                                    <p class="card-text">${obj.description}</p>
                                    <button type="button" id="${
                                      obj.key
                                    }" class="btn btn-outline-danger">Unsave</button>
                                </div>`;
          card.innerHTML = cardContent;
          mainDiv.append(card);
          let btn = document.getElementById(obj.key);
          btn.addEventListener('click', () => {
            deleteFavorites(obj);
          });
        });
      },
      error => {
        console.log(error);
      }
    );
}

function deleteMyAd(ad, key) {
  const res = prompt('Are you sure to delete this ad !\nIf not click cancel.');
  if (res === null) {
    return false;
  }
  firebase
    .database()
    .ref(`users/${firebase.auth().currentUser.uid}/myAds/${key}`)
    .remove();
  firebase
    .database()
    .ref(`users/${firebase.auth().currentUser.uid}/favorites/${key}`)
    .remove();
  firebase
    .database()
    .ref(`ads/${ad.adCategory}/${key}`)
    .remove();
}

function deleteFavorites(ad) {
  firebase
    .database()
    .ref(`users/${firebase.auth().currentUser.uid}/favorites/${ad.key}`)
    .remove();
}

export { searchCategory, searchV, searchB };
export { retrieveData, myAds, searchAds, favorites };
