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

