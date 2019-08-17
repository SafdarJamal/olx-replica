'use strict';

const searchCategory = document.getElementById('search-category');
const searchV = document.getElementById('search-input');
const searchB = document.getElementById('search-btn');

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: null
});

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

  firebase
    .database()
    .ref(field)
    .on(
      'value',
      snapshot => {
        const data = snapshot.val();
        // console.log(data);

        if (searchCategory.value === 'all') {
          const values = Object.values(data);
          // console.log(values);

          const arr = [];
          values.forEach(inObj => {
            let exArr = Object.values(inObj);
            exArr.forEach(gotObj => {
              arr.push(gotObj);
            });
          });

          let mainDiv = document.getElementById('data-box');
          mainDiv.className = 'row';
          mainDiv.innerHTML = '';

          arr.forEach(obj => {
            const cardContent = `
              <div class="card shadow-sm">
                <img src="${obj.photoURL}" class="card-img-top" />
                <div class="card-body">
                  <h5 class="card-title">${formatter.format(obj.price)}</h5>
                  <h6 class="card-title">${obj.title}</h6>
                  <p class="card-text">${obj.description}</p>
                  <button id="${
                    obj.key
                  }" class="btn btn-info">Add to favorites</button>
                </div>
              </div>
            `;

            const card = document.createElement('div');
            card.setAttribute('class', 'col-md-4 mb-4');
            card.innerHTML = cardContent;
            mainDiv.append(card);

            let btn = document.getElementById(obj.key);
            btn.addEventListener('click', () => {
              saveAd(obj, btn);
            });
          });
        } else {
          let mainDiv = document.getElementById('data-box');
          mainDiv.className = 'row';
          mainDiv.innerHTML = '';

          const keys = Object.keys(data);
          keys.forEach(key => {
            let obj = data[key];
            // console.log(data[key]);

            const cardContent = `
              <div class="card">
                <img src="${obj.photoURL}" class="card-img-top" />
                <div class="card-body">
                  <h5 class="card-title">${formatter.format(obj.price)}</h5>
                  <h6 class="card-title">${obj.title}</h6>
                  <p class="card-text">${obj.description}</p>
                  <button id="${
                    obj.key
                  }" class="btn btn-info">Add to favorites</button>
                </div>
              </div>
            `;

            const card = document.createElement('div');
            card.setAttribute('class', 'col-md-4 mb-4');
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
        // console.log(data);

        let mainDiv = document.getElementById('data-box');
        mainDiv.innerHTML = '';

        if (!data) {
          mainDiv.className += ' display-4';
          mainDiv.textContent = 'You dont have any ads.';
          return false;
        }

        const keys = Object.keys(data);
        keys.forEach(key => {
          let obj = data[key];
          // console.log(data[key]);

          const cardContent = `
              <div class="card shadow-sm">
                <img src="${obj.photoURL}" class="card-img-top" />
                <div class="card-body">
                  <h5 class="card-title">${formatter.format(obj.price)}</h5>
                  <h6 class="card-title">${obj.title}</h6>
                  <p class="card-text">${obj.description}</p>
                  <button id="${obj.key}" class="btn btn-danger">Delete</button>
                </div>
              </div>
            `;

          const card = document.createElement('div');
          card.setAttribute('class', 'col-md-4 mb-4');
          card.innerHTML = cardContent;
          mainDiv.append(card);

          let btn = document.getElementById(obj.key);
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

  if (btn.textContent === 'Add to favorites') {
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
        // console.log(data);

        const values = Object.values(data);
        const arr = [];

        values.forEach(inObj => {
          let exArr = Object.values(inObj);
          exArr.forEach(gotObj => {
            arr.push(gotObj);
          });
        });

        let mainDiv = document.getElementById('data-box');
        mainDiv.innerHTML = '';

        arr.forEach(obj => {
          const filter = field.toLowerCase();

          if (obj.title.toLowerCase().indexOf(filter) > -1) {
            const cardContent = `
              <div class="card shadow-sm">
                <img src="${obj.photoURL}" class="card-img-top" />
                <div class="card-body">
                  <h5 class="card-title">${formatter.format(obj.price)}</h5>
                  <h6 class="card-title">${obj.title}</h6>
                  <p class="card-text">${obj.description}</p>
                  <button id="${
                    obj.key
                  }" class="btn btn-info">Add to favorites</button>
                </div>
              </div>
            `;

            const card = document.createElement('div');
            card.setAttribute('class', 'col-md-4 mb-4');
            card.innerHTML = cardContent;
            mainDiv.append(card);

            let btn = document.getElementById(obj.key);
            btn.addEventListener('click', () => {
              saveAd(obj, btn);
            });
          }
        });

        if (mainDiv.textContent === '') {
          mainDiv.textContent = 'Not found';
          mainDiv.className = 'text-center display-3 mb-5';
        } else {
          mainDiv.className = 'row';
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
        // console.log(data);

        let mainDiv = document.getElementById('data-box');
        mainDiv.innerHTML = '';

        if (!data) {
          mainDiv.className += ' display-4';
          mainDiv.textContent = 'You dont have any ads.';
          return false;
        }

        const keys = Object.keys(data);
        keys.forEach(key => {
          let obj = data[key];
          // console.log(data[key]);

          const cardContent = `
              <div class="card shadow-sm">
                <img src="${obj.photoURL}" class="card-img-top" />
                <div class="card-body">
                  <h5 class="card-title">${formatter.format(obj.price)}</h5>
                  <h6 class="card-title">${obj.title}</h6>
                  <p class="card-text">${obj.description}</p>
                  <button id="${obj.key}" class="btn btn-danger">Remove</button>
                </div>
              </div>
            `;

          const card = document.createElement('div');
          card.setAttribute('class', 'col-md-4 mb-4');
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
  const respone = confirm('Are you sure to delete this ad?');

  if (!respone) {
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
