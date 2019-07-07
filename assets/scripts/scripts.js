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
var key = "6c25094e2b7ba0e57995415ce749ed94"


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
    .attr("id", newRecipes[i].recipe_id);
    newP = newRecipes[i].title;
    newImage = $("<img>")
    .attr("src", newRecipes[i].image_url);
    newBreak = $("<br>");
    newButton = $("<button>")
    .attr("id", newRecipes[i].recipe_id)
    .addClass("recipe-btn btn btn-primary")
    .attr("data-toggle", "modal")
    .attr("data-target", "#recipeModal")
    .text("Click here to see the recipe");
    newDiv.append(newP, newBreak, newImage, newButton);
    
    $("#recipe-search-wrapper").append(newDiv);
  }
}

// Retrieves the ingredient information of a single recipe.
function retrieveSingleRecipe() {
  event.preventDefault();
  recipeID = $(this).attr("id");

  queryURL = "https://www.food2fork.com/api/get?key=" + key + "&rId=" + recipeID;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
  .then(function(response) {
    displaySingleRecipe(response)

  })
}


function displaySingleRecipe(response) {
  var results = JSON.parse(response);
  recipeIngredients = results.recipe.ingredients;
  for( i = 0 ; i < recipeIngredients.length; i++) {
    console.log("Ingredient: " + recipeIngredients[i]);
  }
  // console.log("Recipe Ingredients: " + ingredientsArray);
}


  // Testing firebase
  $(document).ready(function() {
    var name = "Let's see if that works.";
    database.ref().push({
        username: name,
    });
  })

  $(document).on("click", ".recipe-btn", retrieveSingleRecipe)