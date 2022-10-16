const authentication = {
    login : async (usr, pwd)=>{
        const loginResponse = await fetch('https://anon-board.a2hosted.com/login', {
            method: 'POST',
            headers : {'Content-Type' : 'application/json',},
            body: JSON.stringify({username: usr, password: pwd})
        });
        const loginResponseJSON = await loginResponse.json();
        console.log(loginResponseJSON);
        return loginResponseJSON;
    }
};

export {authentication};