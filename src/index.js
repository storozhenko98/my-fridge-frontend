// Imports
import { authentication } from "./authenticationModule";
import { registration } from "./registrationModule";
import { DBpost } from "./writeModule";
import { Poll } from "./updateView";
import { UPC } from "./upcModule";
import { dbDelete } from "./deleteModule";
import Quagga from 'quagga';

//Main
const main = document.getElementById("main");
//Auth
const user = {
  authed : false, 
  username : '',
  password : '',
};
//View
const viewController = {
  usrValidate : false,
  pwdValidate : false, 
  phnValidate: false, 
  upcVal: false,
  createLogin : ()=>{
    const usrInput = document.createElement("input");
    const header = document.createElement('div');
    header.innerHTML = "Welcome to my-Fridge";
    header.id = "logHeader";
    usrInput.type = "string";
    usrInput.id = "usrInput";
    usrInput.placeholder = "Enter Username...";
    const pwdInput = document.createElement("input");
    pwdInput.type = "password";
    pwdInput.id = "pwdInput";
    pwdInput.placeholder = "Password...";
    const errorP = document.createElement('p');
    const loginButton = document.createElement("button");
    loginButton.innerHTML = "Login";
    loginButton.id = "loginButton";
    loginButton.addEventListener('click', ()=>{errorP.innerHTML = '';authentication.login(usrInput.value, pwdInput.value)
    .then(r=>{
      if(r['status']=='Login Info Incorrect'){
        errorP.innerHTML = "User does not exist, or password incorrect";
        errorP.style.color = 'red';
      } else {
        user.authed = true;
        user.username = usrInput.value;
        user.password = pwdInput.value;
        viewController.homeView()};
    })});
    const registerButton = document.createElement("button");
    registerButton.innerHTML = "Register";
    registerButton.id = "registerButton";
    registerButton.addEventListener('click', ()=>{viewController.createUsrRegister()});
    main.appendChild(header);
    main.appendChild(usrInput);
    main.appendChild(pwdInput);
    main.appendChild(errorP);
    main.appendChild(loginButton);
    main.appendChild(registerButton);
  },
  createUsrRegister : ()=>{
    main.innerHTML = '';
    const note = document.createElement("p");
    note.innerHTML = '';
    const usrInput = document.createElement("input");
    const usrInputLabel = document.createElement('label');
    usrInputLabel.for = 'regUSR';
    usrInputLabel.id = "regUSRLabel";
    usrInputLabel.innerHTML = "New Username: ";
    usrInput.type = "string";
    usrInput.id = "regUSR";
    usrInput.placeholder = "Username..."
    usrInput.addEventListener('keyup', ()=>{
      if (usrInput.value.length <= 6){
        console.log('check less', usrInput.value.length);
        note.innerHTML = "Username too short.";
        note.style.color = 'red';
        if(viewController.usrValidate == true){
          main.removeChild(validateButton);
          viewController.usrValidate = false;
        }
      } else if (usrInput.value.length > 6){
        console.log('check more', usrInput.value.length);
        note.innerHTML = "Username is up to spec!";
        note.style.color = 'green';
        viewController.usrValidate = true;
        main.appendChild(validateButton);
      }
    });
    const validateButton = document.createElement("button");
    validateButton.id = 'usrValButton'
    validateButton.innerHTML = "Next"
    validateButton.addEventListener('click', ()=>{note.innerHTML='';registration.usrValidate(usrInput.value)
    .then(r=>{
      if(r['status']=='User Exists'){note.innerHTML="User Already Exists...Be Unique!"}
      else {registration.values.finalUsername = usrInput.value; viewController.createUsrPassword()}
    })})
    main.appendChild(usrInputLabel);
    main.appendChild(usrInput);
    main.appendChild(note);
  },
  createUsrPassword : ()=>{
    main.innerHTML = '';
    const note = document.createElement("p");
    note.innerHTML = '';
    const pwdInput = document.createElement("input");
    pwdInput.type = "password";
    pwdInput.id = 'pwdINPUT';
    pwdInput.placeholder = "Password..."
    pwdInput.addEventListener('keyup', ()=>{
      if (pwdInput.value.length <= 6){
        console.log('check less', pwdInput.value.length);
        note.innerHTML = "Password too short.";
        note.style.color = 'red';
        if(viewController.pwdValidate == true){
          main.removeChild(validateButton);
          viewController.pwdValidate = false;
        }
      } else if (pwdInput.value.length > 6){
        console.log('check more', pwdInput.value.length);
        note.innerHTML = "Password is up to spec!";
        note.style.color = 'green';
        viewController.pwdValidate = true;
        main.appendChild(validateButton);
      }
    });
    const validateButton = document.createElement("button");
    validateButton.innerHTML = "Next";
    validateButton.addEventListener('click', ()=>{
      registration.values.finalPassword = pwdInput.value;
      viewController.createPhone(); 
    });
    validateButton.id = "vB";
    const pwdLabel = document.createElement('label');
    pwdLabel.id = "pwdINPUTLabel";
    pwdLabel.for = "pwdINPUT";
    pwdLabel.innerHTML = "Create new password: "
    main.appendChild(pwdLabel);
    main.appendChild(pwdInput);
    main.appendChild(note);
  },
  createPhone : ()=>{
    main.innerHTML = '';
    const note = document.createElement("p");
    note.innerHTML = '';
    const phnInput = document.createElement("input");
    phnInput.placeholder = "Phone number, no area code";
    phnInput.id = 'phnInput';
    phnInput.type = "string";
    phnInput.addEventListener('keyup', ()=>{
      if (phnInput.value.length <= 9 || phnInput.value.length >= 11){
        console.log('check incorrect', phnInput.value.length);
        note.innerHTML = "Phone # must be exactly 10 digits long.";
        note.style.color = 'red';
        if(viewController.phnValidate == true){
          main.removeChild(validateButton);
          viewController.phnValidate = false;
        }
      } else if (phnInput.value.length == 10){
        console.log('check right', phnInput.value.length);
        note.innerHTML = "Phone # is up to spec!";
        note.style.color = 'green';
        viewController.phnValidate = true;
        main.appendChild(validateButton);
      }
    });
    const validateButton = document.createElement("button");
    validateButton.id = "vPB";
    validateButton.innerHTML = "Next";
    validateButton.addEventListener('click', ()=>{note.innerHTML='';registration.phoneValidate(phnInput.value)
    .then(r=>{
      if(r['status']=='Phone Number already in use'){note.innerHTML='Phone # already exists :-('}
      else {registration.values.finalPhone = phnInput.value; viewController.createUserFinal();}
    })})
    const phnLabel = document.createElement('label');
    phnLabel.id = 'phnLabel';
    phnLabel.for = "phnInput";
    phnLabel.innerHTML = "Add your phone number: "
    main.appendChild(phnLabel);
    main.appendChild(phnInput);
    main.appendChild(note);
  },
  createUserFinal : ()=>{
    main.innerHTML = '';
    const msg = document.createElement('div');
    msg.id = "msgFINAL";
    msg.innerHTML = 'See if this is right...';
    const username = document.createElement('div');
    username.id = "usrFINAL";
    username.innerHTML = 'Username: ' + registration.values.finalUsername;
    const password = document.createElement('div');
    password.id = "passwordFINAL";
    password.innerHTML = 'Click to peek Password ;-)';
    password.addEventListener('click', ()=>{
      password.innerHTML = 'Password: ' + registration.values.finalPassword;
      setTimeout(() => {
        password.innerHTML = 'Click to peek Password ;-)'
      }, 3000);
    });
    const phoneNumber = document.createElement('div');
    phoneNumber.id = "phoneNumberFINAL";
    phoneNumber.innerHTML = registration.values.finalPhone;
    const register = document.createElement('button');
    register.id = "regButFINAL";
    register.innerHTML = 'Register!'
    register.addEventListener('click', ()=>{registration.finalRegister(registration.values.finalUsername, registration.values.finalPassword, registration.values.finalPhone)
    .then(r => {
      if(r['status']=='Registered'){
        user.authed = true;
        user.username = registration.values.finalUsername;
        user.password = registration.values.finalPassword;
        main.innerHTML = '';
        authentication.login(user.username, user.password).
        then(r=>{
          viewController.usrValidate = false;
          viewController.pwdValidate = false; 
          viewController.phnValidate = false; 
          if(r['status']=='Logged In'){viewController.homeView()} 
          else {viewController.createLogin()};
        })
      }
    })});
    const tryAgain = document.createElement('button');
    tryAgain.id = "tryAgainFINAL";
    tryAgain.innerHTML = 'Start Over';
    tryAgain.addEventListener('click', ()=>{
      viewController.usrValidate = false;
      viewController.pwdValidate = false; 
      viewController.phnValidate = false; 
      viewController.createUsrRegister()});

    main.appendChild(msg);
    main.appendChild(username);
    main.appendChild(password);
    main.appendChild(phoneNumber);
    main.appendChild(register);
    main.appendChild(tryAgain);
  },
  homeView : ()=>{
    main.innerHTML = '';
    const header = document.createElement('div');
    header.id = 'header';
    header.innerHTML = 'my-Fridge';
    main.appendChild(header);
    const view = document.createElement('div');
    view.id = "view";
    main.appendChild(view);
    const controller = document.createElement('div'); 
    controller.id = 'controller';
    const addButton = document.createElement('button');
    addButton.innerHTML = 'Add +';
    addButton.id = 'addButton'; 
    addButton.addEventListener('click', ()=>{
      viewController.upcQuery();
    })
    const aboutButton = document.createElement('button');
    aboutButton.innerHTML = "About";
    aboutButton.id = "aboutButton";
    const refreshButton = document.createElement('button');
    refreshButton.innerHTML = "Refresh";
    refreshButton.id = "refreshButton";
    refreshButton.addEventListener('click', ()=>{
      document.getElementById('view').innerHTML = '';
      Poll.refresh(user.username, user.password).then(r=>{
        console.log(r);
        console.log(r.list.items);
        let array = r.list.items;
        array.forEach(fObject => {
          let name = fObject.itemType;
          let buyDate = fObject.purchaseDate; 
          let expDate = fObject.expirationDate; 
          let id = fObject.id;
          const itemBox = document.createElement('div');
          itemBox.classList.add('itemBox');
          const itemDetails = document.createElement('div');
          itemDetails.classList.add('itemDetails');
          const idName = document.createElement('div');
          idName.classList.add('itemName');
          const idDesc = document.createElement('div');
          idDesc.classList.add('boughtDate');
          const idDesc1 = document.createElement('div');
          idDesc1.classList.add('expirationDate');
          idName.innerHTML = name;
          idDesc.innerHTML = `Bought: ${buyDate}`;
          idDesc1.innerHTML = `Expires: ${expDate}`;
          itemDetails.appendChild(idName);
          itemDetails.appendChild(idDesc);
          itemDetails.appendChild(idDesc1);
          const deleteButton = document.createElement('button');
          deleteButton.innerHTML = "Delete";
          deleteButton.addEventListener('click', ()=>{
            dbDelete.delete(user.username, user.password, id).then(r=>{
              document.getElementById('view').removeChild(itemBox);
              console.log(r)
            })
          })
          itemBox.appendChild(itemDetails);
          itemBox.appendChild(deleteButton);
          view.appendChild(itemBox); 
        });
      });
    })
    controller.appendChild(refreshButton);
    controller.appendChild(addButton);
    controller.appendChild(aboutButton);
    main.appendChild(controller);
    Poll.refresh(user.username, user.password).then(r=>{
      console.log(r);
      console.log(r.list.items);
      let array = r.list.items;
      array.forEach(fObject => {
        let name = fObject.itemType;
        let buyDate = fObject.purchaseDate; 
        let expDate = fObject.expirationDate; 
        let id = fObject.id;
        const itemBox = document.createElement('div');
        itemBox.classList.add('itemBox');
        const itemDetails = document.createElement('div');
        itemDetails.classList.add('itemDetails');
        const idName = document.createElement('div');
        idName.classList.add('itemName');
        const idDesc = document.createElement('div');
        idDesc.classList.add('boughtDate');
        const idDesc1 = document.createElement('div');
        idDesc1.classList.add('expirationDate');
        idName.innerHTML = name;
        idDesc.innerHTML = `Bought: ${buyDate}`;
        idDesc1.innerHTML = `Expires: ${expDate}`;
        itemDetails.appendChild(idName);
        itemDetails.appendChild(idDesc);
        itemDetails.appendChild(idDesc1);
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Delete";
        deleteButton.addEventListener('click', ()=>{
          dbDelete.delete(user.username, user.password, id).then(r=>{
            document.getElementById('view').removeChild(itemBox);
            console.log(r)
          })
        })
        itemBox.appendChild(itemDetails);
        itemBox.appendChild(deleteButton);
        view.appendChild(itemBox); 
      });
    });
    
  },
  upcQuery : ()=>{
    const header = document.getElementById('header');
    const view = document.getElementById('view');
    const controller = document.getElementById('controller');
    view.innerHTML = '';
    controller.innerHTML = '';
    const codeInput = document.createElement('input');
    const codeInputLabel = document.createElement('label');
    codeInputLabel.for = "codeInput";
    codeInputLabel.innerHTML = "Upload or Take an Image of a Barcode: ";
    codeInputLabel.id = "codeInputLabel";
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
    const checkButton = document.createElement('button');
    checkButton.innerHTML = "Check Code";
    checkButton.addEventListener('click', ()=>{
      if(viewController.upcVal == true){
        return;
      };
      viewController.upcVal = true; 
      if (manOver.value == ''){
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = "Please scan or enter a UPC code.";
        errorMessage.id = "upcERROR";
        main.appendChild(errorMessage);
        setTimeout(() => {
          main.removeChild(errorMessage);
          errorMessage.remove();
        }, 5000);
        return;
      }
      UPC.query(user.username, user.password, manOver.value).then(r => {
        if (r.status == 'No such item'){
          console.log('NO ITEM', r);
          viewController.addView('');
        } else if (r.origin == 'home'){
          console.log(r);
          let nm = r['content']['name'];
          let dt = [r['content']['shelfLife'], 'days'];
          let upcC = r['content']['upcCode'];
          DBpost.amend(user.username, user.password,nm, upcC, dt).then(r=>{console.log(r); viewController.homeView();});
        } else if (r.origin == 'chomp'){
          console.log("CHOMP", r);
          viewController.addView(r['content']['items'][0]['name']);
        };
      });
    })
    const scanDiv = document.createElement('div');
    scanDiv.id = 'scanDiv';
    scanDiv.appendChild(codeInputLabel);
    scanDiv.appendChild(codeInput);
    view.appendChild(scanDiv);
    const manOverLabel = document.createElement('label');
    manOverLabel.for = "manOver";
    manOverLabel.innerHTML = "See if code matches: "
    const mDiv = document.createElement('div');
    mDiv.id = "mDiv";
    mDiv.appendChild(manOverLabel);
    mDiv.appendChild(manOver);
    view.appendChild(mDiv);
    const backButton = document.createElement('button');
    backButton.innerHTML = "Home";
    backButton.addEventListener('click',()=>{
      viewController.homeView();
    })
    controller.appendChild(backButton);
    controller.appendChild(checkButton);

  },
  addView : (nv)=>{
    viewController.upcVal = false; 
    let dDB;
    const upcQ = document.getElementById('manOver').value;
    const view = document.getElementById('view');
    const controller = document.getElementById('controller');
    const itemNameDiv = document.createElement('div');
    itemNameDiv.id = "itemNameDiv";
    const itemName = document.createElement('input');
    itemName.id = "itemName";
    itemName.type = 'String'; 
    itemName.value = nv;
    const iNLabel = document.createElement('label');
    iNLabel.for = "itemName";
    iNLabel.innerHTML = "Product Name: "
    itemNameDiv.appendChild(iNLabel);
    itemNameDiv.appendChild(itemName);
    const datingType = document.createElement('select');
    datingType.id = "datingType";
    const datingTypeLabel = document.createElement('label');
    datingTypeLabel.for = "datingType";
    datingTypeLabel.innerHTML = "Choose unit of time and enter shelf-life: ";
    const datingInputDiv = document.createElement('div');
    datingInputDiv.id = "datingInputDiv"
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
    datingInputDiv.appendChild(initPut);
    datingInputDiv.appendChild(initLabel);
    datingType.addEventListener('change', ()=>{
      if(datingType.value == 'days'){
        const dInput = document.createElement('input');
        dInput.type = 'string';
        dInput.id = 'VAL'
        const label =document.createElement('label');
        label.for = "VAL";
        label.innerHTML = "Days";
        label.id = "LAB";
        datingInputDiv.innerHTML = '';
        datingInputDiv.appendChild(dInput);
        datingInputDiv.appendChild(label);
      } else if (datingType.value == 'weeks'){
        const wInput = document.createElement('input');
        wInput.type = 'string';
        wInput.id = 'VAL'
        const label =document.createElement('label');
        label.for = "VAL";
        label.innerHTML = "Weeks";
        label.id = "LAB";
        datingInputDiv.innerHTML = '';
        datingInputDiv.appendChild(wInput);
        datingInputDiv.appendChild(label);
      } else if (datingType.value == 'calendar'){
        const cInput = document.createElement("input");
        cInput.type = "date";
        cInput.id = 'VAL';
        const cInputLab = document.createElement('label');
        cInputLab.id = "LAB"
        cInputLab.innerHTML = "Calendar";
        cInputLab.for = "VAL";
        const preview = document.createElement('div');
        cInput.addEventListener('change', ()=>{
          preview.innerHTML = cInput.value;
        });
        datingInputDiv.innerHTML = '';
        datingInputDiv.appendChild(cInput);
        datingInputDiv.appendChild(preview);
      }
    })
    controller.innerHTML = '';
    const addButton = document.createElement('button');
    addButton.innerHTML = "Add Item +";
    addButton.addEventListener('click', ()=>{
      dDB = [document.getElementById('VAL').value, document.getElementById('LAB').innerHTML];
      DBpost.write(user.username, user.password, itemName.value, upcQ, dDB).then(r=>{console.log(r); viewController.homeView()})
    });
    const backButton = document.createElement('button');
    backButton.innerHTML = 'Return'; 
    backButton.addEventListener('click', ()=>{viewController.homeView();})
    controller.appendChild(addButton);
    controller.appendChild(backButton);
    view.appendChild(itemNameDiv);
    const datingChoiceDiv = document.createElement('div');
    datingChoiceDiv.id = "datingChoiceDiv";
    datingChoiceDiv.appendChild(datingTypeLabel);
    datingChoiceDiv.appendChild(datingType);
    view.appendChild(datingChoiceDiv);
    view.appendChild(datingInputDiv);


  }

};

//Starter
if (user.authed == false){viewController.createLogin()};

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

