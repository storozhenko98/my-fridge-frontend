const dbDelete = {
    delete : async (usr, pwd, uuid)=>{
        const queryResponse = await fetch('http://localhost:3000/db-delete', {
            method: 'POST',
            headers : {'Content-Type' : 'application/json',},
            body: JSON.stringify({
                username: usr,
                password: pwd,
                uuid: uuid
            })
        });
        const usrJSON = await queryResponse.json();
        return usrJSON;
    },
};

export {dbDelete};