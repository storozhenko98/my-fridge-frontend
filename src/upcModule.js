const UPC = {
    query : async (usr, pwd, upc)=>{
        const queryResponse = await fetch('https://anon-board.a2hosted.com/upc-fetch', {
            method: 'POST',
            headers : {'Content-Type' : 'application/json',},
            body: JSON.stringify({
                username: usr,
                password: pwd, 
                upc : upc
            })
        });
        const usrJSON = await queryResponse.json();
        return usrJSON;
    },
};

export {UPC};