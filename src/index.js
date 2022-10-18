// Imports
import { authentication } from "./authenticationModule";
import { registration } from "./registrationModule";
import { DBpost } from "./writeModule";
import { Poll } from "./updateView";
import { UPC } from "./upcModule";
import { dbDelete } from "./deleteModule";
import Quagga from 'quagga';

//UI
//Main Constants 
const view = document.getElementById("appView");
const buttonOne = document.getElementById("buttonOne");
const buttonTwo = document.getElementById("buttonTwo");
const buttonThree = document.getElementById("buttonThree");
//Reg Constants
const RegData = {
  user : '',
  pwd : '',
  phone: '',
  pwdUI : false
};
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
    buttonOne.addEventListener('click', UI.usrRegisterPage);
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
    buttonOne.removeEventListener('click', UI.usrRegisterPage);
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
          let lsUser = loginUserInput.value;
          let lsPass = loginPassInput.value;
          localStorage.setItem('username', lsUser);
          localStorage.setItem('password', lsPass);
          buttonTwo.removeEventListener('click', homeFunction);
          buttonOne.removeEventListener('click', backFunction);
          buttonThree.removeEventListener('click', UI.aboutPage);
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
            loginErrorNOS.innerText = "Login Error, NOS. Contact admin: mst387@uky.edu";
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
  usrRegisterPage : ()=>{
    if (RegData.pwdUI == false){view.removeChild(landingDiv);}
    RegData.pwdUI = false; 
    //view.removeChild(landingDiv);
    const registerDiv = document.createElement('div');
    registerDiv.id = "registerDiv";
    const registerDivHeader = document.createElement('h2');
    registerDivHeader.id ="registerDivHeader";
    registerDivHeader.innerText = "Let's get you started! Enter a new username: "
    const registerDivMain = document.createElement('div');
    registerDivMain.id = "registerDivMain";
    const usrInput = document.createElement('input');
    usrInput.placeholder = 'New Username...';
    const usrSpec = document.createElement('p');
    usrSpec.innerText = 'Username must be at least six (6) characters long.';
    //Check Constants
    let usrGood = false;
    //Button Action Removal
    buttonOne.removeEventListener('click', UI.usrRegisterPage);
    buttonTwo.removeEventListener('click', UI.loginPage);
    //Input Verifier
    usrInput.addEventListener('keyup', ()=>{
      if(registerDivMain.childElementCount == 3){
        const errorMSG = document.getElementById('usrRegError');
        registerDivMain.removeChild(errorMSG);
      };
      if(usrInput.value.length <= 6){
        usrSpec.style.color = 'red';
        usrGood = false; 
      } else if(usrInput.value.length >= 6){
        usrSpec.style.color = "green";
        usrGood = true; 
      }
    });
    //Button Functions
    const backToLanding = ()=>{
      RegData.user = '';
      UI.landingPage();
      buttonOne.removeEventListener('click', backToLanding);
      buttonTwo.removeEventListener('click', usrRegProceed);
    };
    const usrRegProceed = ()=>{
      if(usrGood == true){
        registration.usrValidate(usrInput.value)
        .then(m=>{
          console.log(m);
          if(m.status == 'Success'){
            RegData.user = usrInput.value; 
            buttonOne.removeEventListener('click', backToLanding);
            buttonTwo.removeEventListener('click', usrRegProceed);
            UI.pwdRegisterPage();
          } else if (m.status == "User Exists"){
            if(registerDivMain.childElementCount == 2){
              const userExistsError = document.createElement('p');
              userExistsError.id = 'usrRegError';
              userExistsError.innerText = "Username " + "'"+usrInput.value+"'" + " already exists";
              userExistsError.style.color = "red";
              registerDivMain.appendChild(userExistsError);
            }
          } else {
            if(registerDivMain.childElementCount == 2){
              const serverError = document.createElement('p');
              serverError.style.color = "red";
              serverError.innerText = "Registration Error, NOS. Contact admin: mst387@uky.edu";
              registerDivMain.appendChild(serverError);
            }
          }
        })
      } else if(usrGood == false){
        usrSpec.style.fontSize = 48 + "px";
        setTimeout(() => {
          usrSpec.style.fontSize = 24 + "px";
        }, 3000);
      }
    }
    //Button Modification
    buttonOne.style.backgroundImage = "url('./assets/back.svg')";
    buttonOne.addEventListener('click', backToLanding);
    buttonTwo.style.backgroundImage = "url('./assets/register.svg')";
    buttonTwo.addEventListener('click', usrRegProceed);
    //Appending
    registerDivMain.appendChild(usrInput);
    registerDivMain.appendChild(usrSpec);
    registerDiv.appendChild(registerDivHeader);
    registerDiv.appendChild(registerDivMain);
    view.appendChild(registerDiv);
  },
  pwdRegisterPage : ()=>{
    //UI Mod Stuff
    registerDivHeader.innerText = "Got the username! Now, enter a new password: "
    registerDivMain.innerHTML = "";
    const pwdRegInput = document.createElement('input');
    pwdRegInput.type = 'password';
    pwdRegInput.placeholder = 'Password...';
    const pwdReqs = document.createElement('ul');
    const pwdLengthReq = document.createElement('li');
    pwdLengthReq.id = 'length';
    pwdLengthReq.innerText = "Password must be at least eight (8) characters";
    const pwdCapReq = document.createElement('li');
    pwdCapReq.id = 'capital';
    pwdCapReq.innerText = "Password must contain at least one (1) capital letter";
    const pwdNumReq = document.createElement('li');
    pwdNumReq.id = 'number';
    pwdNumReq.innerText = "Password must contain at least one (1) number";
    //Verficiation
    let pwdLength = false; 
    let pwdCap = false; 
    let pwdNum = false;  
    pwdRegInput.addEventListener('keyup',()=>{
      let regexCap = /[A-Z]/g
      let regexNum = /\d/g
      if(pwdRegInput.value.length <= 8){
        pwdLengthReq.style.color = "red";
        pwdLength = false;
      } else if (pwdRegInput.value.length >= 8){
        pwdLengthReq.style.color = "green";
        pwdLength = true;
      };
      if(regexCap.test(pwdRegInput.value)){
        pwdCapReq.style.color = 'green';
        pwdCap = true; 
      } else if (!(regexCap.test(pwdRegInput.value))){
        pwdCapReq.style.color = 'red';
        pwdCap = false; 
      };
      if(regexNum.test(pwdRegInput.value)){
        pwdNumReq.style.color = 'green';
        pwdNum = true; 
      } else if (!(regexNum.test(pwdRegInput.value))){
        pwdNumReq.style.color = 'red';
        pwdNum = false; 
      };
    });
    //Button Functions 
    const backToUserReg = ()=>{
      RegData.pwdUI = true; 
      RegData.pwd = '';
      view.innerHTML = '';
      UI.usrRegisterPage();
      buttonOne.removeEventListener('click', backToUserReg);
      buttonTwo.removeEventListener('click', pwdRegProceed);
    };
    const pwdRegProceed =()=>{
      console.log(pwdLength, pwdCap, pwdNum);
      if((pwdLength == true)&&(pwdCap == true)&&(pwdNum == true)){
        RegData.pwd = pwdRegInput.value; 
        buttonOne.removeEventListener('click', backToUserReg);
        buttonTwo.removeEventListener('click', pwdRegProceed);
        UI.phoneRegisterPage();
      } else {
        if(pwdLength == false){
          pwdLengthReq.style.fontSize = 36+ 'px';
          setTimeout(() => {
            pwdLengthReq.style.fontSize= 24 + "px";
          }, 3000);
        }
        if (pwdCap == false){
          pwdCapReq.style.fontSize = 36+ 'px';
          setTimeout(() => {
            pwdCapReq.style.fontSize= 24 + "px";
          }, 3000);
        }
        if (pwdNum == false){
          pwdNumReq.style.fontSize = 36+ 'px';
          setTimeout(() => {
            pwdNumReq.style.fontSize= 24 + "px";
          }, 3000);
        }
      }
    };
    //Events
    buttonOne.addEventListener('click', backToUserReg);
    buttonTwo.addEventListener('click', pwdRegProceed);
    //Appending
    pwdReqs.appendChild(pwdLengthReq);
    pwdReqs.appendChild(pwdCapReq);
    pwdReqs.appendChild(pwdNumReq);
    registerDivMain.appendChild(pwdRegInput);
    registerDivMain.appendChild(pwdReqs);
  },
  phoneRegisterPage: ()=>{
    //UI stuff
    registerDivHeader.innerText = "Got the password! Now, enter your phone number: "
    registerDivMain.innerHTML = "";
    const phoneInput = document.createElement('input');
    phoneInput.id = "phoneInput";
    phoneInput.placeholder = "Phone number...";
    const phoneInputSpec = document.createElement('p');
    phoneInputSpec.innerText = 'Phone number must be ten (10) digits long.';
    //Verification
    let phoneCheck = false; 
    phoneInput.addEventListener('keyup', ()=>{
      let regexPhone = /[A-Z]/gi;
      if(registerDivMain.childElementCount == 3){
        registerDivMain.removeChild(document.getElementById('phoneError'));
      };
      if(phoneInput.value.length == 10 && (!regexPhone.test(phoneInput.value))){
        phoneInputSpec.style.color = 'green';
        phoneCheck = true; 
      } else if(!(phoneInput.value.length == 10 && regexPhone.test(phoneInput.value))){
        phoneInputSpec.style.color = 'red';
        phoneCheck = false;
      };
    });
    //Button functions 
    const backToPwdReg =()=>{
      RegData.phone = '';
      UI.pwdRegisterPage();
      buttonOne.removeEventListener('click', backToPwdReg);
      buttonTwo.removeEventListener('click', finalRegPage);
    };
    const finalRegPage =()=>{
      if (phoneCheck == true){
        registration.phoneValidate(phoneInput.value)
        .then(m=>{
          if(m.status == "Success"){
            RegData.phone = phoneInput.value;
            buttonOne.removeEventListener('click', backToPwdReg);
            buttonTwo.removeEventListener('click', finalRegPage);
            UI.finalRegisterPage();
          } else if (m.status == "Phone Number already in use"){
            const phoneError = document.createElement('p');
            phoneError.id = "phoneError";
            phoneError.innerText = 'Phone number already in use. \n \n Enter a different one.';
            phoneError.style.color = 'red';
            registerDivMain.appendChild(phoneError);
          } else{
            const servError = document.createElement('p');
            servError.innerHTML = "Error NOS. Contact Admin mst387@uky.edu";
            servError.style.color = 'red';
            registerDivMain.appendChild(servError);
          };
        })
      } else if (phoneCheck == false){
        phoneInputSpec.style.fontSize = 48+ 'px';
        setTimeout(() => {
          phoneInputSpec.style.fontSize= 24 + "px";
        }, 3000);
      };
    };
    //Button Events
    buttonOne.addEventListener('click', backToPwdReg);
    buttonTwo.addEventListener('click', finalRegPage);
    //Appending
    registerDivMain.appendChild(phoneInput);
    registerDivMain.appendChild(phoneInputSpec);

  },
  finalRegisterPage: ()=>{
    registerDivHeader.innerText = "Got everything! See if this seems right: "
    registerDivMain.innerHTML = "";
    const usrFinal = document.createElement('div');
    usrFinal.id = 'usrFinal';
    usrFinal.innerHTML = 'Username: ' + RegData.user;
    const pwdFinal = document.createElement('div');
    pwdFinal.id = 'pwdFinal';
    pwdFinal.innerHTML = 'Password: click to see';
    const phoneFinal = document.createElement('div');
    phoneFinal.id = "phoneFinal";
    phoneFinal.innerHTML = 'Phone: ' + RegData.phone;
    const finalMessage = document.createElement('p');
    finalMessage.innerText = 'If this seems right, click register and get signed up!';
    //Pass reveal
    pwdFinal.addEventListener('click', ()=>{
      pwdFinal.innerHTML ='Password: ' + RegData.pwd;
      setTimeout(() => {
        pwdFinal.innerHTML = 'Password: click to see';
      }, 5000);
    })
    //Functions
    const backToPhoneReg =()=>{
      UI.phoneRegisterPage();
      buttonOne.removeEventListener('click', backToPhoneReg);
      buttonTwo.removeEventListener('click', finalReg);
    };
    const finalReg = ()=>{
      registration.finalRegister(RegData.user, RegData.pwd, RegData.phone)
      .then(m=>{
        if(m.status == 'Registered'){
          buttonOne.removeEventListener('click', backToPhoneReg);
          buttonTwo.removeEventListener('click', finalReg);
          localStorage.setItem('username', RegData.user);
          localStorage.setItem('password', RegData.pwd);
          setTimeout(() => {
            authentication.login(localStorage.getItem('username'), localStorage.getItem('password'))
            .then(m=>{
            UI.homePage();
          })
          }, 2000);
        } else {
          const regError = document.createElement('p');
          regError.innerText = 'There has been a registration error. Contact admin at mst387@uky.edu';
          regError.style.color = 'red';
          registerDivMain.appendChild(regError);
        }
      })
    };
    //Button Assignment
    buttonOne.addEventListener('click', backToPhoneReg);
    buttonTwo.addEventListener('click', finalReg);
    //Apppending
    registerDivMain.appendChild(usrFinal);
    registerDivMain.appendChild(pwdFinal);
    registerDivMain.appendChild(phoneFinal);
    registerDivMain.appendChild(finalMessage);

  },
  homePage : ()=>{
    const refreshFunc = () =>{
      console.log('refresh function');
      view.innerHTML = '';
      Poll.refresh(localStorage.getItem('username'), localStorage.getItem('password'))
    .then(m=>{
      console.log(m);
      let itemArray = m.list.items;
      if (itemArray.length == 0){
        const noItems = document.createElement('h2');
        noItems.innerText = 'Scan an item to start!';
        noItems.style.textAlign = 'center';
        noItems.style.marginTop = 5 + '%';
        view.appendChild(noItems);
      }
      itemArray.forEach(itemObject => {
        const name = itemObject.itemType; 
        const buyDate = itemObject.purchaseDate; 
        const expDate = itemObject.expirationDate;
        const id = itemObject.id;
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('itemDiv');
        const itemNameHeader = document.createElement('h4');
        itemNameHeader.classList.add('itemHeader'); 
        itemNameHeader.innerText = name;
        const boughtDateP = document.createElement('p');
        boughtDateP.classList.add('itemBoughtDate');
        boughtDateP.innerText = 'Bought on: ' + buyDate;
        const expireDateP = document.createElement('p');
        expireDateP.classList.add('itemExpireDate');
        expireDateP.innerText = 'Expires on: ' + expDate; 
        const detailDiv = document.createElement('div');
        detailDiv.classList.add('detailDiv');
        detailDiv.appendChild(itemNameHeader);
        detailDiv.appendChild(boughtDateP);
        detailDiv.appendChild(expireDateP);
        const removeButton = document.createElement('button');
        removeButton.style.backgroundImage = "url('./assets/delete.svg')";
        removeButton.addEventListener('click', ()=>{
          dbDelete.delete(localStorage.getItem('username'), localStorage.getItem('password'), id)
          .then(m=>{
            view.removeChild(itemDiv);
            console.log(m);
          })
        })
        itemDiv.appendChild(detailDiv);
        itemDiv.appendChild(removeButton);
        view.appendChild(itemDiv);

      });
    });
    };
    refreshFunc();
    console.log('this is the home page normal refresh!');
    const scanPage =()=>{
      buttonOne.removeEventListener('click', refreshFunc);
      console.log('refresh function removed!')
      buttonTwo.removeEventListener('click', scanPage);
      UI.scanPage();
    };
    const logout =()=>{
      localStorage.clear();
      window.location.reload();
    }
    buttonOne.style.backgroundImage = "url('./assets/sync.svg')";
    buttonTwo.style.backgroundImage = "url('./assets/barcode.svg')";
    buttonThree.style.backgroundImage = "url('./assets/logout.svg')";
    buttonOne.addEventListener('click', refreshFunc);
    console.log('refresh function added to button')
    buttonTwo.addEventListener('click', scanPage);
    buttonThree.addEventListener('click', logout);

    
  },
  scanPage : ()=>{
    //UI Stuff
    view.innerHTML = '';
    const scanDiv = document.createElement('div');
    scanDiv.id = 'scanDiv';
    const addHeader = document.createElement('h2');
    addHeader.innerText = "Scan a UPC barcode to get started!";
    const codeInputLabel = document.createElement('label');
    codeInputLabel.for = "codeInput";
    codeInputLabel.innerHTML = "Upload or Take an Image of a Barcode: ";
    codeInputLabel.id = "codeInputLabel";
    const codeInput = document.createElement('input');
    codeInput.id = "codeInput";
    codeInput.type = 'file';
    codeInput.accept = "image/*;capture=camera";
    codeInput.addEventListener('change', ()=>{
      let fileReady = codeInput.files[0];
      getBase64(fileReady);
    });
    const manOver = document.createElement('input');
    manOver.id = "manOver";
    manOver.type = 'String';
    manOver.placeholder = 'UPC...';
    const reminder = document.createElement('p');
    reminder.innerText = 'Make sure the codes match 😉';
    //Button Function
    const scanFunc =()=>{
      if(manOver.value.length == 0){
        const upcErrorMessage = document.createElement('p');
        upcErrorMessage.style.color = 'red';
        upcErrorMessage.innerText = "You must either scan a UPC-code or enter one manually!";
        upcErrorMessage.style.fontSize = 36 + "px";
        scanDiv.appendChild(upcErrorMessage);
        setTimeout(() => {
          scanDiv.removeChild(upcErrorMessage);
        }, 5000);
        return;
      }
      UPC.query(localStorage.getItem('username'), localStorage.getItem('password'), manOver.value).then(r => {
        if (r.status == 'No such item'){
          console.log('NO ITEM', r);
          buttonTwo.removeEventListener('click', scanFunc);
          buttonOne.removeEventListener('click', backHome);
          UI.addPage('');
        } else if (r.origin == 'home'){
          console.log(r);
          let nm = r['content']['name'];
          let dt = [r['content']['shelfLife'], 'days'];
          let upcC = r['content']['upcCode'];
          DBpost.amend(localStorage.getItem('username'), localStorage.getItem('password'), nm, upcC, dt)
          .then(r=>{console.log(r);
            buttonTwo.removeEventListener('click', scanFunc);
            buttonOne.removeEventListener('click', backHome);
            UI.homePage();
          });
        } else if (r.origin == 'chomp'){
          console.log("CHOMP", r);
          buttonTwo.removeEventListener('click', scanFunc);
          buttonOne.removeEventListener('click', backHome);
          UI.addPage(r['content']['items'][0]['name']);
        };
      });
    };
    const backHome =()=>{
      console.log('back home!');
      buttonOne.removeEventListener('click', backHome);
      buttonTwo.removeEventListener('click', scanFunc);
      UI.homePage();
    };
    //Button image
    buttonOne.style.backgroundImage = "url('./assets/back.svg')";
    //Button Events
    buttonOne.addEventListener('click', backHome);
    buttonTwo.addEventListener('click', scanFunc);
    //Appending
    scanDiv.appendChild(addHeader);
    scanDiv.appendChild(codeInputLabel);
    scanDiv.appendChild(codeInput);
    scanDiv.appendChild(manOver);
    scanDiv.appendChild(reminder);
    view.appendChild(scanDiv);
  },
  addPage : (nv)=>{
    let unitValue; 
    buttonTwo.style.backgroundImage = "url('./assets/add.svg')";
    let dDB;
    const upcQ = document.getElementById('manOver').value;
    const itemName = document.createElement('input');
    itemName.id = "itemName";
    itemName.type = 'String'; 
    itemName.value = nv;
    const iNLabel = document.createElement('label');
    iNLabel.for = "itemName";
    iNLabel.innerHTML = "Product Name: "
    scanDiv.appendChild(iNLabel);
    scanDiv.appendChild(itemName);
    const datingType = document.createElement('select');
    datingType.id = "datingType";
    const datingTypeLabel = document.createElement('label');
    datingTypeLabel.for = "datingType";
    datingTypeLabel.innerHTML = "Expires in / or by: ";
    scanDiv.appendChild(datingTypeLabel);
    scanDiv.appendChild(datingType);
    const day = document.createElement('option');
    day.value = "days";
    day.innerHTML = 'Days';
    const week = document.createElement('option');
    week.value = "weeks";
    week.innerHTML = "Weeks"
    const calendar = document.createElement('option');
    calendar.value = "calendar";
    calendar.innerHTML = "Calendar"; 
    datingType.appendChild(day);
    datingType.appendChild(week);
    datingType.appendChild(calendar);
    const initPut = document.createElement('input');
    initPut.type = "string";
    initPut.id = 'VAL';
    const initLabel = document.createElement('label');
    initLabel.for = 'VAL';
    initLabel.id = "LAB"
    initLabel.innerHTML = 'Days';
    unitValue = 'days';
    scanDiv.appendChild(initPut);
    scanDiv.appendChild(initLabel);
    datingType.addEventListener('change', ()=>{
      if(datingType.value == 'days'){
        scanDiv.removeChild(document.getElementById('VAL'));
        scanDiv.removeChild(document.getElementById('LAB'));
        unitValue = 'days';
        const initPut = document.createElement('input');
        initPut.type = "string";
        initPut.id = 'VAL';
        const initLabel = document.createElement('label');
        initLabel.for = 'VAL';
        initLabel.id = "LAB"
        initLabel.innerHTML = 'Days';
        scanDiv.appendChild(initPut);
        scanDiv.appendChild(initLabel);
      } else if (datingType.value == 'weeks'){
        scanDiv.removeChild(document.getElementById('VAL'));
        scanDiv.removeChild(document.getElementById('LAB'));
        unitValue = 'weeks';
        const initPut = document.createElement('input');
        initPut.type = "string";
        initPut.id = 'VAL';
        const initLabel = document.createElement('label');
        initLabel.for = 'VAL';
        initLabel.id = "LAB"
        initLabel.innerHTML = 'Weeks';
        scanDiv.appendChild(initPut);
        scanDiv.appendChild(initLabel);

      } else if (datingType.value == 'calendar'){
        scanDiv.removeChild(document.getElementById('VAL'));
        scanDiv.removeChild(document.getElementById('LAB'));
        unitValue = 'calendar';
        const cInput = document.createElement("input");
        cInput.type = "date";
        cInput.id = 'VAL';
        const cInputLab = document.createElement('label');
        cInputLab.id = "LAB"
        cInputLab.innerHTML = "Calendar: ";
        cInputLab.for = "VAL";
        scanDiv.appendChild(cInputLab);
        scanDiv.appendChild(cInput);
      }
    })
    const writeToDB =()=>{
      dDB = [document.getElementById('VAL').value, unitValue];
      DBpost.write(localStorage.getItem('username'), localStorage.getItem('password'), itemName.value, upcQ, dDB)
      .then(r=>{console.log(r);
        buttonTwo.removeEventListener('click', writeToDB);
        UI.homePage();
        buttonOne.removeEventListener('click', backHome);
      })
    };
    const backHome =()=>{
      console.log('back home!');
      buttonOne.removeEventListener('click', backHome);
      buttonTwo.removeEventListener('click', writeToDB);
      UI.homePage();
    };
    //button apped
    buttonOne.addEventListener('click', backHome);
    buttonTwo.addEventListener('click', writeToDB);

  },
  aboutPage : ()=>{

  },
};

authentication.login(localStorage.getItem('username'), localStorage.getItem('password'))
.then(r=>{
  if(r.status == 'Logged In'){
    UI.homePage();
  } else {UI.landingPage()};
});

//Bar Code Reader
function getBase64(file) {
   const reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload =()=>{
     console.log(reader.result);
     Quagga.decodeSingle({
      decoder: {
          readers: ["ean_reader", "upc_reader", "upc_e_reader", "ean_8_reader"] // List of active readers
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

