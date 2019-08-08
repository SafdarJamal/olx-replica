let password = document.getElementById('password');
let showHideBtn = document.getElementById('show-hide');

function showHide() {
  const fieldAtt = password.getAttribute('type');
  // console.log(fieldAtt);
  if (fieldAtt === 'password') {
    password.setAttribute('type', 'text');
    showHideBtn.innerHTML = 'hide';
  } else {
    password.setAttribute('type', 'password');
    showHideBtn.innerHTML = 'show';
  }
}

showHideBtn.onclick = showHide;
