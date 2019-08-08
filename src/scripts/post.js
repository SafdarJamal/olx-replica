"use strict";

/**
 * Post Ads
 */

let adCategory = document.getElementById("ad-category");
let brand = document.getElementById("brand");
let condition = document.getElementById("condition");
let title = document.getElementById("title");
let description = document.getElementById("description");
let price = document.getElementById("price");
let photo = document.getElementById("photo");
let postB = document.getElementById("post-button");

let brLabel = document.getElementById("br-label");
function catChange() {
    if (adCategory.value === "properties") {
        brLabel.textContent = "Location";
    } else {
        brLabel.textContent = "Brand";
    }
}

function validatePost() {
    const regex = /^[A-Za-z0-9.-_#'*+/;$&:"@%,-?(!)]?([\ ]?[A-Za-z0-9.-_#*+/;$&:@%,-?(!)])+$/;
    if (adCategory.value === "CHOOSE A CATEGORY") {
        console.log("Category is requird !");
        return false;
    } else if (!brand.value.match(regex)) {
        if (brLabel.textContent === "Location") {
            console.log("Location is requird !");
            return false;
        }
        console.log("Brand name is requird !");
        return false;
    } else if (condition.value === "Condition") {
        console.log("Condition is requird !");
        return false;
    } else if (!title.value.match(regex)) {
        console.log("Title is requird !");
        return false;
    } else if (!description.value.match(regex)) {
        console.log("Description is requird !");
        return false;
    } else if (!price.value.match("^[0-9]+$")) {
        console.log("Price is requird !");
        return false;
    } else if (photo.value === "") {
        console.log("Photo is requird !");
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
        brand: brand.value,
        condition: condition.value,
        title: title.value,
        description: description.value,
        price: price.value,
        photo: photo.files[0].name
    };
    if (adCategory.value === "properties") {
        ad.location = brand.value;
        delete ad.brand;
    }
    if (postB.classList.contains("disabled")) {
        return false;
    }
    postB.className += " disabled";
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
                            console.log("My Ad Successfully Posted");
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
                            console.log("Successfully Posted");
                            location.replace("http://localhost:8080/");
                        }
                    });
            })
            .catch(error => {
                console.log(error);
            });
    });
}

export {
    adCategory,
    brand,
    brLabel,
    condition,
    title,
    description,
    price,
    photo,
    postB
};
export { catChange, postAd };
