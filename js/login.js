const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
let uppass = [];
let inpass = [];
let userImgPassInput = [];
signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
  inpass = [];
  uppass = [];
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
  inpass = [];
  uppass = [];
});
// adding and removing border
function upimg(element) {
  var Image = element.querySelector("img");
  if (Image) {
    if (Image.classList.contains("clicked")) {
      Image.classList.remove("clicked");
      uppass.splice(uppass.indexOf(element.id), 1);
    } else {
      Image.classList.add("clicked");
      uppass.push(element.id);
    }
  }
}

function inimg(element) {
  var Image = element.querySelector("img");
  if (Image) {
    if (Image.classList.contains("clicked")) {
      Image.classList.remove("clicked");
    } else {
      Image.classList.add("clicked");
    }
  }
}
// element image recognition
async function signup() {
  const email = document.getElementById("upmail").value;
  const password = document.getElementById("s-pass").value;
  const imgPass = uppass;

  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, imgPass })
    });
    const result = await response.json();
    alert(result.message);
  } catch (err) {
    console.error(err);
    alert("Signup Failed: Connection Error");
  }
}
// image pattern authentication
var v2 = new Boolean(false);
async function signin() {
  userImgPassInput = [];
  const email = document.getElementById("inmail").value;
  const password = document.getElementById("l-pass").value;
  
  const clickedImage = document.getElementsByClassName("clicked");
  for (let index = 0; index < clickedImage.length; index++) {
    userImgPassInput.push(clickedImage[index].parentElement.id);
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, imgPass: userImgPassInput })
    });
    const result = await response.json();
    alert(result.message);
    if (response.ok) {
      NewTab();
    }
  } catch (err) {
    console.error(err);
    alert("Login Failed: Connection Error");
  }
}

function NewTab() {
  window.open("index.html", "_blank");
}

// TIMEPASS KA CODE //
// const inpassBtn = document.getElementsByClassName("inpass");
// const timepassBtn = document.getElementsByClassName("timepass");
// graphicMode = true;
// for (let index = 0; index < timepassBtn.length; index++) {
//   timepassBtn[index].addEventListener("click", function (event) {
//     console.log(event.target);
//     if (graphicMode) {
//       graphicMode = false;
//       inpassBtn[0].style.display = "none";
//       inpassBtn[1].style.display = "none";
//     } else {
//       graphicMode = true;
//       inpassBtn[0].style.display = "block";
//       inpassBtn[1].style.display = "block";
//     }
//   });
// }
