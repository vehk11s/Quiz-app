const SERVER = "http://127.0.0.1:3000";

async function getCategories() {
    
    const settings = {
        method: "GET",
        headers:{'Content-Type':'application/json'}
    };

    try {
        let response = await fetch(SERVER + "/categories", settings);
        const categories = await response.json();

        console.log(categories);
        return categories;
    }
    catch(error){
        console.log("Error while fetching the categories.",error);
        return 0;
    }
};

