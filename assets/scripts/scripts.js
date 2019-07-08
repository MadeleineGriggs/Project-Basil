  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDLGabsANQ8jKELPND_EQun-VAOGjD5R-c",
    authDomain: "project-basil-db62e.firebaseapp.com",
    databaseURL: "https://project-basil-db62e.firebaseio.com",
    projectId: "project-basil-db62e",
    storageBucket: "",
    messagingSenderId: "107913695337",
    appId: "1:107913695337:web:323e2e145c63685e"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();




//   Food2Fork API Key (Main): 6c25094e2b7ba0e57995415ce749ed94
//   Second Test API Key: b11d8301b0ecfac319569f557e520e48
var key = "49d0a6d68d5cc628b7d10db08a79038e"


// Food2Fork Search API Call

$("#recipe-search-btn").on("click", function() {
    event.preventDefault();
    searchTerm = $("#recipe-search").val();
    var queryURL = "https://www.food2fork.com/api/search?key=" + key + "&q=" + searchTerm;

    $.ajax({
        url: queryURL,
        method: "GET"
      })
      .then(function(response) {
        displayRecipes(response);
      })
})

// Displays the recipes the user is searching for.
function displayRecipes(response) {
  var results = JSON.parse(response);

  recipeCount = results.count;
  newRecipes = results.recipes;
  for (i = 0; i < recipeCount; i ++) {
    newDiv = $("<div>")
    .attr("id", newRecipes[i].recipe_id)
    .addClass("card")
    .css("width", "18rem")
    newP = newRecipes[i].title;
    newImage = $("<img>")
    .attr("src", newRecipes[i].image_url)
    .addClass("card-img-top")
    .attr("alt", "an image of the cooked recipe");
    divBody = $("<div>")
    .addClass("card-body");
    cardTitle = $("<h5>")
    .addClass("card-title")
    .text(newRecipes[i].title);
    cardText = $("<p>")
    .addClass("card-text")
    .text("testing card text");
    newButton = $("<button>")
    .attr("id", newRecipes[i].recipe_id)
    .attr("recipe-name", newRecipes[i].title)
    .addClass("recipe-btn btn btn-primary")
    .attr("data-toggle", "modal")
    .attr("data-target", "#recipeModal")
    .text("Click here to see the recipe");
    newDiv.append(newImage, divBody);
    divBody.append(cardTitle, cardText, newButton)
    $("#recipe-search-wrapper").append(newDiv);
  }
}


{/* <div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div> */}




// Retrieves the ingredient information of a single recipe.
function retrieveSingleRecipe() {
  event.preventDefault();
  recipeID = $(this).attr("id");
  recipeTitle = $(this).attr("recipe-name");
  $(".modal-title").empty();
  $(".modal-title").text(recipeTitle);
  queryURL = "https://www.food2fork.com/api/get?key=" + key + "&rId=" + recipeID;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
  .then(function(response) {
    displaySingleRecipe(response)

  })
}

// Displays a single recipe's ingredients in a modal window.
function displaySingleRecipe(response) {
  var results = JSON.parse(response);
  // recipeIngredients is an array. We will need to send this information to Edamam for nutritional information.
  recipeIngredients = results.recipe.ingredients;
  $(".modal-body").empty();
  for( i = 0 ; i < recipeIngredients.length; i++) {
    newP = $("<p>").text(recipeIngredients[i])
    $(".modal-body").append(newP);
  }

//Added call to display calorie data   
 displayCaloriesJSON(recipeIngredients, results.recipe.title);

}


  // Testing firebase
  $(document).ready(function() {
    var name = "Let's see if that works.";
    database.ref().push({
        username: name,
    });
  })

  $(document).on("click", ".recipe-btn", retrieveSingleRecipe)


/* ---------------Edamam--------------- */


//Retrieve Nutrition Data for single ingredient
 function displayCaloriesJSON (recipeIngredients, title){
  
  var data = {
    title: title,
    ingr: recipeIngredients
  } 

var  url = 'https://api.edamam.com/api/nutrition-details?app_id=b134a78c&app_key=ef4e767c7f1d336096dc31d4396b7964'
   $.ajax({
      'type': 'POST',
      'url': url,
      'contentType': 'application/json',
      'data': JSON.stringify(data),
      'dataType': 'json',
      'success': function(data) {
        // console.log(data.calories);
        $(".modal-body").append("<p> Calories: "+data.calories+"</p>");   
    },
    'error': function(data) {
        successmessage = 'Error';
        $("label#successmessage").text(successmessage);
    },
  });

}


