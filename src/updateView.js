const Poll = {
    refresh : async (usr, pwd)=>{
        const queryResponse = await fetch('https://anon-board.a2hosted.com/db-fetch', {
            method: 'POST',
            headers : {'Content-Type' : 'application/json',},
            body: JSON.stringify({
                username: usr,
                password: pwd
            })
        });
        const usrJSON = await queryResponse.json();
        return usrJSON;
    },
};

export {Poll};