const SERVER = "http://127.0.0.1:3000";

async function getCategories() {
    
    const settings = {
        method: "GET",
        headers:{'Content-Type':'application/json'}
    };

    try {
        let response = await fetch(SERVER + "/categories", settings);
        const categories = await response.json();

        return categories;
    }
    catch(error){
        console.log("Error while fetching the categories.",error);
        return 0;
    }
};

export async function categoryButtons() {
    const categories = getCategories().then(data => {
        let buttons = document.getElementById('chooseCategory');
        data.forEach(function(object)
        {
            const categoryName = object.category;
            const categoryId = object.id;

            const label = document.createElement("label");
            label.htmlFor = categoryName;
            label.innerText = categoryName;
            buttons.appendChild(label);

            const input = document.createElement("input");
            input.type = "radio";
            input.id = categoryName;
            input.name = "category"
            input.value = categoryId;
            buttons.appendChild(input);
        
        });
    });
};