let screensData = []
let book = () => {
    var myHeaders = new Headers();
    myHeaders.append("token", localStorage.getItem("token"));
    myHeaders.append("Content-Type", "application/json");

    let messageDiv = document.querySelector(".mess");
    messageDiv.classList.remove("show");

    var raw = JSON.stringify({
        show: showId,
        screen: {
            sc: document.querySelector(".screen").options[document.querySelector(".screen").selectedIndex].text,
            st: document.querySelector(".seat").options[document.querySelector(".seat").selectedIndex].text,
        },
    });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    let ok = true;

    fetch(api + "/ticket", requestOptions)
        .then((response) => {
            if (!response.ok) {
                ok = false;
            }
            return response.json();
        })
        .then((result) => {
            if (!ok) {
                throw result;
            }
            console.log(result);
            location.href = "./ticketBooked.html";
        })
        .catch((error) => {
            console.log("error", error);
            messageDiv.innerHTML = error["message"];
            messageDiv.classList.add("show");
        });
};

let renderShow = (data) => {
    let ps = document.querySelectorAll(".deets > p");
    ps[0].innerHTML = data.movie.name;
    ps[1].innerHTML = data.movie.lang;
    ps[2].innerHTML = data.s_date;
    ps[3].innerHTML = data.e_date;
    ps[4].innerHTML = data.theater.name;
    ps[5].innerHTML = data.theater.type;
    ps[6].innerHTML = data.theater.location;
    ps[7].innerHTML = `
                    <select id='dropdown1' class='screen' onchange="screenChange(this.value)">

                    </select>`;
    data.screens.forEach((ele) => {
        ps[7].getElementsByClassName("screen")[0].innerHTML += `<option>${ele.name}</option>`;
    });
    ps[8].innerHTML = `
                    <select id='dropdown2' class='seat'>

    </select>
                      `;
    data.screens[0].f_seats.forEach((ele) => {
        ps[8].getElementsByClassName("seat")[0].innerHTML += `<option>${ele}</option>`;
    });
    ps[9].innerHTML = data.price;
};


let screenChange = (val) => {
    let seatSelect = document.querySelector('.seat')
    console.log(val)
    let index = screensData.findIndex(({ name }) => { return name == val })
    seatSelect.innerHTML = ""
    screensData[index]["f_seats"].forEach(ele => {
        seatSelect.innerHTML += `<option>${ele}</option>`;
    });
}




let showId = location.href.split("id=").pop();
var myHeaders = new Headers();
myHeaders.append("token", localStorage.getItem("token"));

var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
};

fetch(api + "/show/spec?id=" + showId, requestOptions)
    .then((response) => response.json())
    .then((result) => {
        console.log(result);
        screensData = result["screens"]
        renderShow(result);
    })
    .catch((error) => console.log("error", error));
