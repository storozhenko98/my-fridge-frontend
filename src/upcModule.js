const UPC = {
    query : async (usr, pwd, upc)=>{
        const queryResponse = await fetch('http://localhost:3000/upc-fetch', {
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