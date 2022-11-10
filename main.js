
function getDate(){
    const date = new Date();
    console.log(date.getDate());
}
getDate();

async function getUsers() {
    let response = await fetch('https://www.balldontlie.io/api/v1/games?seasons[]=2022');
    let data = await response.json();
    return data;
}

// getUsers().then(data => console.log(data));
