const DBpost = {
    write : async(usr, pwd, name, upc, date)=>{
        const dbResponse = await fetch('http://localhost:3000/add-to-db', {
            method: 'POST',
            headers : {'Content-Type' : 'application/json',},
            body: JSON.stringify({
                username: usr,
                password: pwd, 
                name: name,
                upc: upc, 
                date: date
            })
        });
        const usrJSON = await dbResponse.json();
        return usrJSON;
    },
    amend : async(usr, pwd, name, upc, date)=>{
        const dbResponse = await fetch('https://anon-board.a2hosted.com/add-to-db', {
            method: 'POST',
            headers : {'Content-Type' : 'application/json',},
            body: JSON.stringify({
                username: usr,
                password: pwd, 
                name: name,
                upc: upc, 
                date: date
            })
        });
        const usrJSON = await dbResponse.json();
        return usrJSON;
    }
};

export {DBpost};