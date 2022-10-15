// Imports
import { authentication } from "./authenticationModule";
import { registration } from "./registrationModule";
import { DBpost } from "./writeModule";
import { Poll } from "./updateView";
import { UPC } from "./upcModule";
import { dbDelete } from "./deleteModule";
import Quagga from 'quagga';
import aboutImg from './assets/about.svg';
import backImg from './assets/back.svg';
import barcodeImg from './assets/barcode.svg';
import deleteImg from './assets/delete.svg';
import loginImg from './assets/login.svg';
import logoutImg from './assets/logout.svg';
import registerImg from './assets/register.svg';
import syncImg from './assets/sync.svg';
// Local Storage
//localStorage.setItem('username', 'none');
//localStorage.setItem('password', 'none');
//UI
//Main Constants 
const view = document.getElementById("appView");
const buttonOne = document.getElementById("buttonOne");
const buttonTwo = document.getElementById("buttonTwo");
const buttonThree = document.getElementById("buttonThree");
//UI Object
const UI = {
  landingPage : ()=>{
    //View Content
    const landingDiv = document.createElement("div");
    landingDiv.id = "landingDiv";
    const landingDivHeader = document.createElement("h2");
    landingDivHeader.id = "landingDivHeader";
    landingDivHeader.innerHTML = "Welcome to myFridge🧊!";
    const landingDivMain = document.createElement("p");
    landingDivMain.id = "landingDivMain";
    landingDivMain.innerText = "This webapp is a way for you to keep track of what is in your fridge and when it expires! \n \n All you have to do is scan the barcode of the item you bought 📸! \n \n This way you can avoid being sick 🥴🤢🤮! \n \n Login or Register to Start!";
    landingDiv.appendChild(landingDivHeader);
    landingDiv.appendChild(landingDivMain);
    view.innerHTML = '';
    view.appendChild(landingDiv);
    //Button Content
    buttonOne.style.backgroundImage = "url('./assets/register.svg')";
    buttonOne.addEventListener('click', UI.registerPage);
    buttonTwo.style.backgroundImage = "url('./assets/login.svg')";
    buttonTwo.addEventListener('click', UI.loginPage);
    buttonThree.style.backgroundImage = "url('./assets/about.svg')";
    buttonThree.addEventListener('click', UI.aboutPage);
  },
  loginPage : ()=>{
    //UI Elements Modding
    view.removeChild(landingDiv);
    const loginDiv = document.createElement('div');
    loginDiv.id = 'loginDiv';
    const loginDivHeader = document.createElement('h2');
    loginDivHeader.id = 'loginDivHeader';
    loginDivHeader.innerHTML = "Enter your username and password!";
    const loginUserInput = document.createElement('input');
    loginUserInput.type = 'String';
    loginUserInput.placeholder = 'Username...';
    const loginPassInput = document.createElement('input');
    loginPassInput.type = 'password';
    loginPassInput.placeholder = 'Password...';
    buttonOne.style.backgroundImage = "url('./assets/back.svg')";
    //Removal of Event Listeners
    buttonOne.removeEventListener('click', UI.registerPage);
    buttonTwo.removeEventListener('click', UI.loginPage);
    //Functions 
    //Back Function
    const backFunction = ()=>{UI.landingPage(); 
    buttonOne.removeEventListener('click', backFunction);
    buttonTwo.removeEventListener('click', homeFunction)};
    //Home Function
    const homeFunction = ()=>{
      authentication.login(loginUserInput.value, loginPassInput.value)
      .then(m=>{
        //If Login Info is Correct
        if(m.status == 'Logged In'){
          console.log("YAY");
          let lsUser = loginUserInput.value;
          let lsPass = loginPassInput.value;
          localStorage.setItem('username', lsUser);
          localStorage.setItem('password', lsPass);
          buttonTwo.removeEventListener('click', homeFunction);
          buttonOne.removeEventListener('click', backFunction);
          UI.homePage();
        }
        //If Login Info is Incorrect
        else if (m.status == 'Login Info Incorrect'){
          if(loginDiv.childElementCount == 3){
            const incorrectLogin = document.createElement('p');
            incorrectLogin.classList.add('loginError');
            incorrectLogin.innerText = "Login Info Incorrect 👀 👀 👀";
            loginDiv.appendChild(incorrectLogin);
          };
        }
        //For Login Error NOS
        else {
          if(loginDiv.childElementCount == 3){
            const loginErrorNOS = document.createElement('p');
            loginErrorNOS.classList.add('loginError');
            loginErrorNOS.innerText = "Login Issue; NOS";
            loginDiv.appendChild(incorrectLogin);
          };
        }
      });
    };
    //Appending 
    buttonOne.addEventListener('click', backFunction);
    buttonTwo.addEventListener('click', homeFunction);
    loginDiv.appendChild(loginDivHeader);
    loginDiv.appendChild(loginUserInput);
    loginDiv.appendChild(loginPassInput);
    view.appendChild(loginDiv);
  },
  registerPage : ()=>{
    
  },
  homePage : ()=>{

  },
  scanPage : ()=>{

  },
  addPage : ()=>{

  },
  aboutPage : ()=>{

  }
};

UI.landingPage();

//Bar Code Reader
function getBase64(file) {
   var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
     console.log(reader.result);
     Quagga.decodeSingle({
      decoder: {
          readers: ["upc_reader"] // List of active readers
      },
      locate: true, // try to locate the barcode in the image
      src: reader.result // or 'data:image/jpg;base64,' + data
  }, function(result){
      if(result.codeResult) {
          console.log("result", result.codeResult.code);
          document.getElementById("manOver").value = result.codeResult.code;
      } else {
          console.log("not detected");
      }
  });
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
}

