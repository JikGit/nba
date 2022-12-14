const matches = document.getElementById("matches");
const classifica = document.getElementById("classifica");
const statistiche = document.getElementById("statistiche");
const giocatori = document.getElementById("giocatori");

//games yesterday-a week
async function getAllGames() {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);

    startDate = startDate.getFullYear() + '-' + (startDate.getMonth() + 1)+ '-' + startDate.getDate();
    endDate = endDate.getFullYear() + '-' + (endDate.getMonth()+1) + '-' + endDate.getDate();

    let response = await fetch('https://www.balldontlie.io/api/v1/games?per_page=100&start_date=' + startDate + '&end_date=' + endDate);
    //ordine per giorno
    let games = await response.json()
    let data = games['data'];
    data.sort((a, b) => {
        aDate = new Date(a.date);
        bDate = new Date(b.date);
        if (aDate < bDate) return -1;
        else return 1;
    })

    //ordine per array di date
    let allData = [];
    let index = -1;
    let currentDate = new Date("2000-1-1");
    data.forEach(x => {
        xDate = new Date(x.date);
        if (xDate > currentDate){
            index++;
            allData.push([x]);
            currentDate = xDate;
        }else allData[index].push(x);
    })

    return allData;
}

// async function getDayGames(day, month = 0, year = 0) {
//     if (month == 0) month = new Date().getMonth()+1;
//     if (year == 0) year = new Date().getFullYear();
//     let date = year + '-' + month + '-' + day;

//     let response = await fetch('https://www.balldontlie.io/api/v1/games?dates[]='+date)
//     let games = await response.json()
//     let data = games['data'];
//     return data;
// }


function getCurrentState(){
    const currentStateName = document.querySelector("#topBar > #links > .selected");
    const currentStateElm = document.querySelector("#"+ currentStateName.innerHTML.toLowerCase());
    return currentStateElm;
}


// MATCHES
if (getCurrentState().id == "matches"){
    getAllGames().then(allData => {
        allData.forEach(data => {
            const giornataElm = document.createElement("div");
            const giornoNumberElm = document.createElement("p");
            const dataGame = data[0]["date"].split("T")[0];
            giornataElm.classList.add("giornata");
            giornoNumberElm.classList.add("giornoNumber")
            giornoNumberElm.innerHTML = dataGame;
            giornataElm.appendChild(giornoNumberElm);

            data.forEach((games) => {
                const squadraCasa = games["home_team"]["name"];
                const squadraTrasferta = games["visitor_team"]["name"];
                let punteggioCasa = games["home_team_score"];
                let punteggioTrasferta = games["visitor_team_score"];
                const oraPartita = games["status"];

                const gameElm = document.createElement("div");
                const oraPartitaElm = document.createElement("p");
                const frecciaElm = document.createElement("i");

                gameElm.classList.add("game")
                oraPartitaElm.classList.add("dataPartita");
                frecciaElm.classList.add('fa-solid', 'fa-caret-right');

                oraPartitaElm.innerHTML = oraPartita;

                //squadra in casa
                const squadraCasaElm = document.createElement("div");
                const nomeCasaElm = document.createElement("p");
                const punteggioCasaElm = document.createElement("p");

                squadraCasaElm.classList.add("squadra", "casa")
                nomeCasaElm.classList.add("nomeSquadra");
                punteggioCasaElm.classList.add("punteggio");
                nomeCasaElm.innerHTML = squadraCasa;
                punteggioCasaElm.innerHTML = punteggioCasa;


                //squadra in trasferta
                const squadraTrasfertaElm = document.createElement("div");
                const nomeTrasfertaElm = document.createElement("p");
                const punteggioTrasfertaElm = document.createElement("p");

                squadraTrasfertaElm.classList.add("squadra", "trasferta")
                nomeTrasfertaElm.classList.add("nomeSquadra");
                punteggioTrasfertaElm.classList.add("punteggio");
                nomeTrasfertaElm.innerHTML = squadraTrasferta;
                punteggioTrasfertaElm.innerHTML = punteggioTrasferta;

                //setto l'elemento games partita, se gia' fatta => "conclusa"
                // se ancora da giocare niente punteggi
                if (oraPartita == "Final"){
                    //a chi vince metto vincente come classe e appendo la freccia
                    if (punteggioCasa > punteggioTrasferta){
                        squadraCasaElm.classList.add("vincente");
                        squadraCasaElm.appendChild(frecciaElm);
                    }else {
                        squadraTrasfertaElm.classList.add("vincente");
                        squadraTrasfertaElm.appendChild(frecciaElm);
                    }

                    punteggioCasa == "";
                    punteggioTrasferta = "";
                    //niente orario perche' gia' conclusa
                    oraPartitaElm.innerHTML = "Conclusa";

                
                }
                
                squadraCasaElm.appendChild(nomeCasaElm);
                squadraCasaElm.appendChild(punteggioCasaElm);
                squadraTrasfertaElm.appendChild(nomeTrasfertaElm);
                squadraTrasfertaElm.appendChild(punteggioTrasfertaElm);

                gameElm.appendChild(squadraCasaElm);
                gameElm.appendChild(squadraTrasfertaElm);
                gameElm.appendChild(oraPartitaElm);

                giornataElm.appendChild(gameElm);

            })
            matches.appendChild(giornataElm)
        })
    })
}

