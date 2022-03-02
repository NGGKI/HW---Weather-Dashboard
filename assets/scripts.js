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
  //getting API for forecast
  const apinameUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=b7b948a57862060a1beafe1ce924a6ac`;

  fetch(apinameUrl)
    .then((res) => res.json())
    .then((data) => {
      //if city not found. return alert and not save info
      if (data.cod === "404") {
        return alert("Location not found!");
      }
      //adding new input into an array
      cities.push(cityName);
      localStorage.setItem("cities", JSON.stringify(cities));
      //show the keyword to listed history
      var retrieveInput = localStorage.getItem("cities");
      var readyOutput = JSON.parse(retrieveInput);
      renderCity(cityName);
      /*  console.log(data); */

      //filter forecast info and push to main html
      let forecastText = "";
      data.list.forEach((item, index) => {
        if (
          index == 0 ||
          index == 8 ||
          index == 16 ||
          index == 24 ||
          index == 32
        ) {
          const date = item.dt_txt.slice(0, 10);
          var convertTemp1 = (item.main.temp - 273.15) * 1.8 + 3;
          var readyTemp1 = convertTemp1.toString().slice(0, 5);
          const forecastBox = `<div id="box">
                <h4 id="fDate">${date}</h4>
                <li id="fTemp">Temp:${readyTemp1}°F</li>
                <li id="fWind">Wind:${item.wind.speed} MPH</li>
                <li id="fHum">Humidity:${item.main.humidity} %</li>
              </div>`;
          return (forecastText += forecastBox);
        }
      });

      document.getElementById("boxes").innerHTML = forecastText;
      document.getElementById("header2").style.display = "block";

      //getting lat and lon for UV index
      var lat = data.city.coord.lat;
      var lon = data.city.coord.lon;
      //getting api for UV index
      const uvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=b7b948a57862060a1beafe1ce924a6ac`;

      fetch(uvUrl)
        .then((res) => res.json())
        .then((data1) => {
          /* console.log(data1); */

          let currentText = "";
          var cUv = data1.current.uvi;
          var convertTemp = (data1.current.temp - 273.15) * 1.8 + 3;
          var readyTemp = convertTemp.toString().slice(0, 5);

          //filter and push current weather into main html
          const currentBox = `<div id="today">
            <h1 id="header1">Today Weather</h1>
            <li id="ctemp">Temperature:${readyTemp} °F</li>
            <li id="chum">Humidity:${data1.current.humidity} %</li>
            <li id="cwind">Wind Speed:${data1.current.wind_speed} MPH</li>
            <li id="cuv">UV Index: <span id="cuv-value">${cUv}</span></li>
          </div>`;

          currentText += currentBox;

          document.getElementById("today").innerHTML = currentText;

          // create a condition of UV color
          if (cUv < 2) {
            document.getElementById("cuv-value").style.backgroundColor =
              "green";
          } else if (cUv >= 2 && cUv <= 3) {
            document.getElementById("cuv-value").style.backgroundColor =
              "orange";
          } else {
            document.getElementById("cuv-value").style.backgroundColor = "red";
          }
        });
    });
}

//search function
searchBtn.addEventListener("click", () => {
  var newInput = textInput.value;
  getCityLocation(newInput);
  textInput.value = ""
});

//dash board time
setInterval(() => {
  document.getElementById("time").textContent = moment().format(
    "MMMM Do, YYYY [at] hh:mm:ss a"
  );
}, 1000);
