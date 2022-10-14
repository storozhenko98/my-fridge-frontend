const registration = {
    values: {
        finalUsername: '',
        finalPassword: '',
        finalPhone: ''
    },
    usrValidate: async (usr)=>{
        const usrResponse = await fetch('http://localhost:3000/register/userValidate', {
            method: 'POST',
            headers : {'Content-Type' : 'application/json',},
            body: JSON.stringify({username: usr})
        });
        const usrJSON = await usrResponse.json();
        return usrJSON;
    },
    phoneValidate: async(phn)=>{
        const phoneResponse = await fetch('http://localhost:3000/register/phoneValidate', {
            method: 'POST',
            headers : {'Content-Type' : 'application/json',},
            body: JSON.stringify({phone: phn})
        });
        const usrJSON = await phoneResponse.json();
        return usrJSON;
    },
    finalRegister: async(usr, pwd, phn)=>{
        const regResponse = await fetch('http://localhost:3000/register/finalRegister', {
            method: 'POST',
            headers : {'Content-Type' : 'application/json',},
            body: JSON.stringify({username: usr, password: pwd, phone: phn})
        });
        const usrJSON = await regResponse.json();
        return usrJSON;
    }
};

export {registration};