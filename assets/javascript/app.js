$(document).ready(function () {
    $('#search_results').hide();
    $('#suggestion_header').hide();

    //================================================================================================
    //Search and Display Weather Info (Section 1)
    //================================================================================================

    $(document).on("click", "#searchLocation", function (event) { //when user clicks the search button
        event.preventDefault(); //prevents the form from submitting itself
        var userInput = $("#searchInput").val().trim(); //retrieve the texts that user inputs
        var inputArr = userInput.split(",")
        //userInput is a string of city and country, we need to split the string at the comma, into an array that contains
        //2 items: city and country. Do a console.log(inputArr) --> ["los angeles", "us"] --> this is what we want for the Weather API ajax call

        //Store each index into a var to plug into the query URL later:
        var cityName = inputArr[0];
        var country = inputArr[1];
        var apiKey1 = "c6ab9da6663a3be45b9f754658c32b90";
        var queryWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "," + country + "&appid=" + apiKey1;

        //Now we do the Weather ajax call:
        $.ajax({
            url: queryWeather,
            method: "GET"
        }).then(function (response) {

            //Store the info that Object gives out in variables to make it easier to manipulate:
            var resultCityName = response.name;
            var weatherCode = (response.weather[0].id);
            var weatherDescription = (response.weather[0].description).toUpperCase();

            //Convert temperature string in Object into integer, to plug into calculation:
            var mainTemp = parseInt(response.main.temp);
            var highTemp = parseInt(response.main.temp_max);
            var minTemp = parseInt(response.main.temp_min);

            //Convert Kelvin into Fahrenheit and Celcius:
            var currentFah = kelToF(mainTemp);
            var currentCel = kelToC(mainTemp);
            var highFah = kelToF(highTemp);
            var highCel = kelToC(highTemp);
            var minFah = kelToF(minTemp);
            var minCel = kelToC(minTemp);

            //Grab ID and attach temperatures to display on HTML:
            $("#resultCityName").html(resultCityName + "<br> <H6>Weather</H6>");
            $("#currentWeather").text(weatherDescription);
            $("#currentTemp").text(currentFah + '\xB0F' + ' / ' + currentCel + '\xB0C');
            $('#highTemp').text(highFah + '\xB0F' + ' / ' + highCel + '\xB0C');
            $('#minTemp').text(minFah + '\xB0F' + ' / ' + minCel + '\xB0C');
            var str = String(weatherCode);

            if (str.startsWith("2") == true) {
                $("#icon").attr("src", "./assets/images/Icons/thunderstorm_icon.png");
                $("#lower_display").css("background", "url(./assets/images/backgrounds/thunderstorm.jpg)");
            } else if (str.startsWith("3") == true) {
                $("#icon").attr("src", "./assets/images/Icons/drizzle_icon.png");
                $("#lower_display").css("background", "url(./assets/images/backgrounds/drizzle.jpg)");
            } else if (str.startsWith("5") == true) {
                $("#icon").attr("src", "./assets/images/Icons/rain_icon.png");
                $("#lower_display").css("background", "url(./assets/images/backgrounds/rain.jpg)");
            } else if (str.startsWith("6") == true) {
                $("#icon").attr("src", "./assets/images/Icons/snow_icon.png");
                $("#lower_display").css("background", "url(./assets/images/backgrounds/snow.jpg)");
            } else if (str.startsWith("7") == true) {
                $("#icon").attr("src", "./assets/images/Icons/atmosphere_icon.png");
                $("#lower_display").css("background", "url(./assets/images/backgrounds/atmosphere.jpg)");
            } else if (str.startsWith("800") == true) {
                $("#icon").attr("src", "./assets/images/Icons/clear_icon.png");
                $("#lower_display").css("background", "url(./assets/images/backgrounds/clear.jpg)");
            } else if (str.startsWith("801") == true || str.startsWith("802") == true || str.startsWith("803") == true || str.startsWith("804") == true) {
                $("#icon").attr("src", "./assets/images/Icons/clouds_icon.png");
                $("#lower_display").css("background", "url(./assets/images/backgrounds/clouds.jpg)");
            }

            //console.log(response)
            var foodHot = ["ice cream", "sandwiches", "salads", "jamba juice", "juice", "boba", "ice tea", "milk tea", "slushies", "fruits", "parfait", "ceviche", "sushi", "hummus", "popsicles",];
            var foodCold = ["tea", "coffee", "hot cocoa", "hot chocolate", "soups", "ramen", "spicy food", "oatmeal", "pot pie", "pho", "pasta"];
            var randHot = foodHot[Math.floor(Math.random() * foodHot.length)];
            var randCold = foodCold[Math.floor(Math.random() * foodCold.length)];

            function hotOrCold(currentFah) {
                if (currentFah >= 65) {
                    return randHot;
                } else if (currentFah < 65) {
                    return randCold;
                };
            }
            hotOrCold();
            console.log(hotOrCold(currentFah));

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + hotOrCold(currentFah) + "&location=" + userInput + "&limit=5",
                "method": "GET",
                "headers": {
                    "Authorization": "Bearer IwHA5UrtrqeH3DqL3fwQN8s8J-1Z60jBP2IcLJSmKQ5i3aQKWWlYTNGj4KyaMLuI7dSg1WMi9lTGHv6c2aoKm8S85gilFYXJSbWbZA0dNUKEu-PzQq57PfMfhP5YXHYx",
                }
            }

            $.ajax(settings).done(function (response) {
                console.log(response);
                $('#form').hide();
                $('#search_results').show();
                $('#suggestion_header').show();
                $('#suggestion_header').append(hotOrCold(currentFah) + " from:");

                var results = response.businesses;

                for (let i = 0; i < results.length; i++) {
                    var name = $("<p>").text("Name: " + results[i].name);
                    var rating = $("<p>").text("Raiting: " + results[i].rating + " / 5");
                    var price = $("<p>").text("Price: " + results[i].price);
                    var location = $("<p>").text("Location: " + results[i].location.address1);
                    var newCard = $("<div>");
                    var cardImg = $("<img>");
                    var cardBody = $("<div>");

                    newCard.attr({
                        "class": "card newCard",
                        "width": "20vw",
                        "height": "30vh"
                    });
                    newCard.append(cardImg);
                    cardImg.attr({
                        "src": results[i].image_url,
                        "class": "card-img-top img-fluid cardImg",
                        "width": "200 vw",
                        "height": "200 vh",
                        "style": "object-fit: cover"
                    });
                    newCard.append(cardBody);
                    cardBody.append(name);
                    cardBody.append(rating);
                    cardBody.append(price);
                    cardBody.append(location);



                    $('#mainID').append(newCard);
                }


                $('#restaurant_cards').show();
            });

        });
    });
    //The Weather API gives out temperature in Kelvin, we need to convert it to Fahrenheit and Celcius
    function kelToF(kelvin) {
        return Math.floor((kelvin * 9 / 5 - 459.67)); //round down to whole integer using Math.floor()
    };

    function kelToC(kelvin) {
        return Math.floor((kelvin - 273.15)); //round down to whole integer using Math.floor()
    };
});