const db = require('./mongodb');


(async function temp(){
    const item=await db
    console.log(item)
})();