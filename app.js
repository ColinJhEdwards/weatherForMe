$(document).ready(function () {
  //global stuff
  const apiKey = "b5c842f082af7c42b54113072b2a2dc6";
  const currentDay = moment().format("L");

  function getRequestUrl(cityName) {
    return `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b5c842f082af7c42b54113072b2a2dc6&units=imperial`;
  }
  function requestUvIndex(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=b5c842f082af7c42b54113072b2a2dc6&units=imperial`;
  }

  //event listeners
  $("#searchBtn").on("click", function (e) {
    e.preventDefault();
    let cityName = $("#cityInput").val();
    getWeatherData(cityName);
    createSearchHistory(cityName);
    $("#cityInput").val("");
  });

  //functions
  function getWeatherData(cityName) {
    $.ajax({
      url: getRequestUrl(cityName),
      method: "GET",
    }).then(function (data) {
      console.log(data);
      $("#location").text(data.name + " " + currentDay);
      $("#currentTemp").text("Temp: " + data.main.temp);
      $("#currentHumi").text("Humidity: " + data.main.humidity);
      $("#currentWS").text("Wind Speed: " + data.wind.speed);
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      getUvIndex(lat, lon);
    });
  }

  function getUvIndex(lat, lon) {
    $.ajax({
      url: requestUvIndex(lat, lon),
      method: "GET",
    }).then(function (data) {
      console.log(data);
      $("#currentUV").text("UV Index: " + data.current.uvi);
    });
  }

  function createSearchHistory(cityName) {
    const newBtn = $("<button>");
    newBtn.addClass("citySearched");
    newBtn.text(cityName);
    $(".searchHistory").prepend(newBtn);
  }
});
