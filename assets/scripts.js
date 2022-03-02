///local storage saving keyword search
var textInput = document.getElementById("input");
var textOutput = document.getElementById("output");
var searchBtn = document.getElementById("searchbtn");
var fDate = document.getElementById("fDate");
var fTemp = document.getElementById("fTemp");
var fHum = document.getElementById("fHum");
var fWind = document.getElementById("fWind");

//adding new input into the array
var cities;

if (localStorage.getItem("cities")) {
  //true
  cities = JSON.parse(localStorage.getItem("cities"));
} else {
  cities = [];
}

renderListcity();

//render the list of cities
function renderCity(cityvalue) {
  var b = document.createElement("button");
  b.innerHTML = cityvalue;
  b.setAttribute("class", "btn");
  textOutput.appendChild(b);
}

// render the cities list from storage
function renderListcity() {
  return cities.forEach((item) => {
    renderCity(item);
  });
}

function getCityLocation(cityName) {
  //getting API
  const apinameUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=b7b948a57862060a1beafe1ce924a6ac`;

  fetch(apinameUrl)
    .then((res) => res.json())
    .then((data) => {
      //if city not found. return alert and not save info
      if (data.cod === "404") {
        return alert("Location not found!");
      }
      cities.push(cityName);
      localStorage.setItem("cities", JSON.stringify(cities));
      //show the keyword to listed history
      var retrieveInput = localStorage.getItem("cities");
      var readyOutput = JSON.parse(retrieveInput);
      renderCity(cityName);
      console.log(data);

      let forecastText = ""
      data.list.forEach((item, index) => {
        if (index == 0 || index == 8 || index == 16 || index == 24 || index == 32) {
          const date = item.dt_txt.slice(0, 10)
          const forecastBox = `<div id="box">
                <h4 id="fDate">${date}</h4>
                <li id="fTemp">Temp:${item.main.temp}</li>
                <li id="fWind">Wind:${item.wind.speed}</li>
                <li id="fHum">Humidity:${item.main.humidity}</li>
              </div>`
          return forecastText += forecastBox
        }
      })

      document.getElementById("boxes").innerHTML = forecastText
      /* document.getElementById("header1").style.display = 'block' */
      document.getElementById("header2").style.display = 'block'

      var lat = data.city.coord.lat;
      var lon = data.city.coord.lon;

      const uvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=b7b948a57862060a1beafe1ce924a6ac`;

      fetch(uvUrl)
        .then((res) => res.json())
        .then((data1) => {
          console.log(data1);

          let currentText = ""
          var cUv = data1.current.uvi
          const currentBox = `<div id="today">
            <h1 id="header1">Today Weather</h1>
            <li id="ctemp">Temperature:${data1.current.temp}</li>
            <li id="chum">Humidity:${data1.current.humidity}</li>
            <li id="cwind">Wind Speed:${data1.current.wind_speed}</li>
            <li id="cuv">UV Index: <span id="cuv-value">${cUv}</span></li>
          </div>`

          currentText += currentBox

          document.getElementById("today").innerHTML = currentText

          if (cUv < 2) {
            document.getElementById("cuv-value").style.backgroundColor = "green"
          } else if (cUv >= 2 && cUv <= 3) {
            document.getElementById("cuv-value").style.backgroundColor = "orange"
          } else {
            document.getElementById("cuv-value").style.backgroundColor = "red"
          }

        });
    });
}

//search function
searchBtn.addEventListener("click", () => {
  var newInput = textInput.value;
  getCityLocation(newInput);
});

//dash board time
setInterval(() => {
  document.getElementById("time").textContent = moment().format(
    "MMMM Do, YYYY [at] hh:mm:ss a"
  );
}, 1000);
