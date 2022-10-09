import { authentication } from "./authenticationModule";
import { registration } from "./registrationModule";
import { DBpost } from "./writeModule";
import { Poll } from "./updateView";
import { UPC } from "./upcModule";
import { dbDelete } from "./deleteModule";
import Quagga from 'quagga';


const main = document.getElementById("main");

const user = {
  authed : false, 
  username : '',
  password : '',
};

const viewController = {
  usrValidate : false,
  pwdValidate : false, 
  phnValidate: false, 
  createLogin : ()=>{
    const usrInput = document.createElement("input");
    usrInput.type = "string";
    usrInput.id = "usrInput";
    usrInput.placeholder = "Enter Username...";
    const pwdInput = document.createElement("input");
    pwdInput.type = "password";
    pwdInput.id = "pwdInput";
    const errorP = document.createElement('p');
    const loginButton = document.createElement("button");
    loginButton.innerHTML = "Login";
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
    registerButton.addEventListener('click', ()=>{viewController.createUsrRegister()});
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
    usrInput.type = "string";
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
    validateButton.innerHTML = "Next"
    validateButton.addEventListener('click', ()=>{note.innerHTML='';registration.usrValidate(usrInput.value)
    .then(r=>{
      if(r['status']=='User Exists'){note.innerHTML="User Already Exists...Be Unique!"}
      else {registration.values.finalUsername = usrInput.value; viewController.createUsrPassword()}
    })})
    main.appendChild(usrInput);
    main.appendChild(note);
  },
  createUsrPassword : ()=>{
    main.innerHTML = '';
    const note = document.createElement("p");
    note.innerHTML = '';
    const pwdInput = document.createElement("input");
    pwdInput.type = "password";
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
    validateButton.innerHTML = "Next"
    validateButton.addEventListener('click', ()=>{
      registration.values.finalPassword = pwdInput.value;
      viewController.createPhone(); 
    });
    main.appendChild(pwdInput);
    main.appendChild(note);
  },
  createPhone : ()=>{
    main.innerHTML = '';
    const note = document.createElement("p");
    note.innerHTML = '';
    const phnInput = document.createElement("input");
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
    validateButton.innerHTML = "Next"
    validateButton.addEventListener('click', ()=>{note.innerHTML='';registration.phoneValidate(phnInput.value)
    .then(r=>{
      if(r['status']=='Phone Number already in use'){note.innerHTML='Phone # already exists :-('}
      else {registration.values.finalPhone = phnInput.value; viewController.createUserFinal();}
    })})
    main.appendChild(phnInput);
    main.appendChild(note);
  },
  createUserFinal : ()=>{
    main.innerHTML = '';
    const msg = document.createElement('div');
    msg.innerHTML = 'See if this is right...';
    const username = document.createElement('div');
    username.innerHTML = 'Username: ' + registration.values.finalUsername;
    const password = document.createElement('div');
    password.innerHTML = 'Click to peek Password ;-)';
    password.addEventListener('click', ()=>{
      password.innerHTML = 'Password: ' + registration.values.finalPassword;
      setTimeout(() => {
        password.innerHTML = 'Click to peek Password ;-)'
      }, 3000);
    });
    const phoneNumber = document.createElement('div');
    phoneNumber.innerHTML = registration.values.finalPhone;
    const register = document.createElement('button');
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
          const itemDetails = document.createElement('div');
          const idName = document.createElement('div');
          const idDesc = document.createElement('div');
          idName.innerHTML = name;
          idDesc.innerHTML = `Bought: ${buyDate}.
          Expires: ${expDate}`;
          itemDetails.appendChild(idName);
          itemDetails.appendChild(idDesc);
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
        const itemDetails = document.createElement('div');
        const idName = document.createElement('div');
        const idDesc = document.createElement('div');
        idName.innerHTML = name;
        idDesc.innerHTML = `Bought: ${buyDate}.
        Expires: ${expDate}`;
        itemDetails.appendChild(idName);
        itemDetails.appendChild(idDesc);
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Delete";
        deleteButton.addEventListener('click', ()=>{
          dbDelete.delete(user.username, user.password, id).then(r=>{
            view.removeChild(itemBox);
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
          //r.content
          //DBpost.write(user.username, user.password, itemName.value, upcQ, dDB).then(r=>{console.log(r); viewController.homeView()})
        } else if (r.origin == 'chomp'){
          console.log("CHOMP", r);
          viewController.addView(r['content']['items'][0]['name']);
        };
      });
    })
    view.appendChild(codeInput);
    view.appendChild(manOver);
    const backButton = document.createElement('button');
    backButton.innerHTML = "Home";
    backButton.addEventListener('click',()=>{
      viewController.homeView();
    })
    controller.appendChild(backButton);
    controller.appendChild(checkButton);

  },
  addView : (nv)=>{
    let dDB;
    const upcQ = document.getElementById('manOver').value;
    const view = document.getElementById('view');
    const controller = document.getElementById('controller');
    const itemName = document.createElement('input');
    itemName.id = "itemName";
    itemName.type = 'String'; 
    itemName.value = nv;
    const iNLabel = document.createElement('label');
    iNLabel.for = "itemName";
    iNLabel.innerHTML = "Product Name: "
    const datingType = document.createElement('select');
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
      dDB = [document.getElementById('VAL').value, document.getElementById('LAB')];
      DBpost.write(user.username, user.password, itemName.value, upcQ, dDB).then(r=>{console.log(r); viewController.homeView()})
    });
    const backButton = document.createElement('button');
    backButton.innerHTML = 'Return'; 
    backButton.addEventListener('click', ()=>{viewController.homeView();})
    controller.appendChild(addButton);
    controller.appendChild(backButton);
    view.appendChild(iNLabel);
    view.appendChild(itemName);
    view.appendChild(datingType);
    view.appendChild(datingInputDiv);


  }

};


if (user.authed == false){viewController.createLogin()};



/*const dbDelete = async (data) =>{
  const response = await fetch('http://localhost:3000/db-delete', {
    method: 'POST',
    headers : {'Content-Type' : 'application/json',},
    body: JSON.stringify(data)
  })
  const api = await response.json();
  console.log(api, typeof(api));
};

const abc = {
  username: 'niki98',
  password: '081298',
  uuid: '95e2fda9-40a0-4bdc-a41e-98c39bfbe281',
}

dbDelete(abc);

*/
/*const upcFetch = async (code) =>{
  const response = await fetch('http://localhost:3000/upc-fetch', {
    method: 'POST',
    headers : {'Content-Type' : 'application/json',},
    body: JSON.stringify({upc:code})
  })
  const api = await response.json();
  console.log(api, typeof(api));
};

upcFetch('009342242343');
*/

/*import Quagga from 'quagga';
const main = document.getElementById("main");
const input = document.createElement("input");
input.type = "file";
input.addEventListener('change', ()=>{
  let fileReady = input.files[0];
  getBase64(fileReady);
})
main.appendChild(input);

const upCode = document.createElement("input");
upCode.type = "string";
upCode.placeholder = "UPC code..."
main.appendChild(upCode);

*/

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

