const dbDelete = {
    delete : async (usr, pwd, uuid)=>{
        const queryResponse = await fetch('https://anon-board.a2hosted.com/db-delete', {
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