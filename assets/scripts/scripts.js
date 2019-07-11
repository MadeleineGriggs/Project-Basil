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
  var currentUser = null;
  var currentUserRecipes = null;
  var dbState;
  var tempUserName;

  database.ref().once("value", function(snapshot){
    dbState = snapshot;
});


$(document).on("click", "#fav-recipe-img-button", function(){
  currentUserRecipes.once("value", function(snapshot){
    
    snapshot.forEach((child) => {
      console.log(child.val().recipe_name, 'recipe id', child.val().recipe_id);
    });
  });
});


$("#new-user-btn").on("click", function() {
  tempUserName = $("#new-user-input").val().toUpperCase().trim();
  if (!dbState.child("/" + tempUserName).exists()) {
    hideArea();
  currentUser = database.ref("/" +tempUserName );
  currentUserRecipes = database.ref("/" + tempUserName + "/recipes");
  currentUser.set({
      username : $("#new-user-input").val().trim()
  });
  } else alert('Username Already Exists');
});



$("#existing-user-btn").on("click", function() {
  tempUserName = $("#existing-user-input").val().toUpperCase().trim();
  console.log(tempUserName);
  if (dbState.child("/" + tempUserName).exists()) {
    hideArea();
      currentUser = database.ref("/" + tempUserName);
      currentUserRecipes = database.ref("/" + tempUserName + "/recipes");
      console.log('you are "logged in"');
  } else alert("Username not found");
});

if (currentUser !== null){
currentUser.on("value", function(snapshot){
  dbState = snapshot;
}
)}


//   Food2Fork API Key (Main): 6c25094e2b7ba0e57995415ce749ed94
//   Second Test API Key: b11d8301b0ecfac319569f557e520e48
var key = "6c25094e2b7ba0e57995415ce749ed94";
// 4247b53c340768859ea9ae29a96ea93f third key


// Food2Fork Search API Call
function retreiveRecipes() {
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

}

// Displays the recipes the user is searching for.
function displayRecipes(response) {
  var results = JSON.parse(response);
  console.log(results);

  $(".recipe-search-container").removeClass("hidden");
  recipeCount = results.count;
  newRecipes = results.recipes;
  for (i = 0; i < recipeCount; i ++) {
    newDiv = $("<div>")
    .attr("id", newRecipes[i].recipe_id)
    .addClass("card")
    newP = newRecipes[i].title;
    newSourceURL = newRecipes[i].source_url;
    newImage = $("<img>")
    .attr("src", newRecipes[i].image_url)
    .addClass("card-img-top")
    .attr("alt", "an image of the cooked recipe")
    divBody = $("<div>")
    .addClass("card-body");
    cardTitle = $("<h5>")
    .addClass("card-title")
    .text(newRecipes[i].title);
    sourceLink = $("<a>")
    .attr("href", newSourceURL)
    .attr("target", "_blank")
    .text(newSourceURL);
    cardText = $("<p>")
    .addClass("card-text")
    .prepend("Source URL: ")
    .append(sourceLink)
    .append("<p> Popularity Rank: " + newRecipes[i].social_rank + "</p>");
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

// Retrieves the ingredient information of a single recipe.
function retrieveSingleRecipe() {
  event.preventDefault();
  recipeID = $(this).attr("id");
  recipeTitle = $(this).attr("recipe-name");
  $("#ingredient-modal-title").empty();
  $("#ingredient-modal-title").text(recipeTitle);
  queryURL = "https://www.food2fork.com/api/get?key=" + key + "&rId=" + recipeID;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
  .then(function(response) {
    displaySingleRecipe(response)

  });
}

var recipeItemCounter = 2;
// Adds another ingredient field to the custom recipe maker form
$("#add-recipe-item-btn").on("click", function() {
  var recipeForm = $("#recipe-form-group");
  recipeItemCounter++;
  var newFormGroup = $("<div>")
    .addClass("form-group form-group-item");
  var newLabel = $("<label>")
    .attr("for", "recipe-form-item")
    .text("Ingredient");
  var newInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control form-item")
    .attr("placeholder", "a fresh new ingredient");
    var newDismiss = $("<button>")
    .attr("type", "button")
    .addClass("close form-close")
    .attr("aria-label", "close");
    var newBtnSpan = $("<span>")
    .attr("aria-hidden", "true")
    .html("&times;");
    newDismiss.append(newBtnSpan);
    newFormGroup.append(newLabel, newInput, newDismiss);
    recipeForm.append(newFormGroup); 
})

// Removes whichever recipe ingredient field the user clicked to dismiss.
function dismissIngredient() {
  $(this).parent().remove();
  recipeItemCounter--;
}

// When the user clicks to save a recipe, this function creates a json object
// to send to the Edamam API for nutritional information
// Should also use this to save to firebase.
function saveUserRecipe() {
  var recipeTitle = $(".form-title").val();
  var ingredientArray = [];
  $(".form-item").each(function() {
    var ingredient = $(this).val();
    ingredientArray.push(ingredient);
  })
  var customRecipedata = {
    title: recipeTitle,
    ingr: ingredientArray
  } 
  displayCaloriesJSON(ingredientArray, recipeTitle);
  displayNewUserRecipe(customRecipedata);
}



// After a user has saved their new recipe, this function
// displays the new recipe and the new nutritional information in the modal.
function displayNewUserRecipe(recipeData) {
  $("#ingredient-modal-title").empty();
  $("#ingredient-modal-body").empty();
  $("#ingredient-modal-title").text(recipeData.title);
  for( i=0 ; i < recipeData.ingr.length ; i++ ) {
    newP = $("<p>").text(recipeData.ingr[i]);
    $("#ingredient-modal-body").append(newP);
  }

  
}

class recipeConstructor {
  constructor(name, id, url, image, count) {
    this.recipeName = name;
    this.recipeId = id;
    this.recipeUrl = url;
    this.recipeImage = image;
    this.usageCount = count;
  }
}

// Displays a single recipe's ingredients in a modal window.
function displaySingleRecipe(response) {
  results = JSON.parse(response);
  var results = JSON.parse(response);
  console.log(results.title);
  
  
  // recipeIngredients is an array. We will need to send this information to Edamam for nutritional information.
  recipeIngredients = results.recipe.ingredients;
  newSource = $("<p>")
  .html("See Full Recipe at: " + "<span><a href='" + results.recipe.source_url +"' target='_blank'>" + results.recipe.source_url + "</span>");
  $("#ingredient-modal-body").empty();
  $("#ingredient-modal-body").prepend(newSource);
  for( i = 0 ; i < recipeIngredients.length; i++) {
    newP = $("<p>").text(recipeIngredients[i]);
    $("#ingredient-modal-body").append(newP);
  }
  $("#saveRecipe").on("click", function(){
    console.log(results.recipe.title, results.recipe.recipe_id, results.recipe.source_url, results.recipe.image_url);
    // selectedRecipe = new recipeConstructor(results.recipe.title, results.recipe.recipe_id, results.recipe.source_url, results.recipe.image_url, 0);
    currentUserRecipes.push({
      
      recipe_name: results.recipe.title, recipe_id: results.recipe.recipe_id, recipe_url: results.recipe.source_url, recipe_image: results.recipe.image_url, usage_count: 0
    
  });
 results= null;
    });


  //   // selectedRecipe = new recipeConstructor(results.recipe.title, results.recipe.recipe_id, results.recipe.source_url, results.recipe.image_url, 0);
  //   currentUser.push({
  //     recipe_name: results.recipe.title,
  //     recipe_id: results.recipe.recipe_id,
  //     recipe_url: results.recipe.source_url,
  //     recipe_image: results.recipe.image_url,
  //     usage_count: 0
      

  // });
 
  //   });


//Added call to display calorie data   
 displayCaloriesJSON(recipeIngredients, results.recipe.title);

}

function hideArea() {
  event.preventDefault();
 $(".landing-container").addClass("d-none");
 $(".recipe-area-container").removeClass("hidden");
}


  // Testing firebase
  // $(document).ready(function() {

    // this function allows the page to smoothly scroll to whichever
// id or class you call it from.
// $.fn.scrollView = function () {
//   return this.each(function () {
//       $('html, body').animate({
//           scrollTop: $(this).offset().top
//       }, 1000);
//   });
// }

// $("#recipe-search-btn").on("click", function() {
//   $("#recipe-search-display").scrollView();
// })




// Sticky Nav: When it is at top, make visible

var distance = 750;

$(window).scroll(function() {
    if ( $(this).scrollTop() >= distance ) {
      console.log("is in top");
        $("#sticky-nav").removeClass("hidden-nav");
        $("#sticky-nav").addClass("visible-nav");
    } else {
      $("#sticky-nav").removeClass("visible-nav");
      $("#sticky-nav").addClass(" fixed-top hidden-nav");
    }
});

$("#recipe-search-btn").on("click", function() {
  $(".recipe-search-container").scrollView();
});
// })
    // database.ref().push({
    //     username: name,
    // });
  // });

  $(document).on("click", ".recipe-btn", retrieveSingleRecipe);
  $(document).on("click", ".form-close", dismissIngredient);
  $(document).on("click", "#saveRecipe", saveUserRecipe);
  $(document).on("click", "#top-recipe-img-button", retreiveRecipes);
  $(document).on("click", "#recipe-search-btn", retreiveRecipes);
  // $(document).on("click", "#new-user-btn", hideArea);
  // $(document).on("click", "#existing-user-btn", hideArea);


/* ---------------Edamam--------------- */


//Retrieve Nutrition Data for single ingredient
 function displayCaloriesJSON(recipeIngredients, title){
  
  var data = {
    title: title,
    ingr: recipeIngredients
  }; 

var  url = 'https://api.edamam.com/api/nutrition-details?app_id=b134a78c&app_key=ef4e767c7f1d336096dc31d4396b7964'
   $.ajax({
      'type': 'POST',
      'url': url,
      'contentType': 'application/json',
      'data': JSON.stringify(data),
      'dataType': 'json',
      'success': function(data) {
        console.log(data);
        var calDisplay = "<p> Calories: " + data.calories + "</p>";
        var fatDisplay = "<p> Total Fat: " + Math.round(data.totalNutrients.FAT.quantity) + " grams</p>";
        var fatSatDisplay = "<p> Total Saturated Fat: " + Math.round(data.totalNutrients.FASAT.quantity) + " grams</p>";
        var fatPolyDisplay = "<p> Total Polyunsaturated Fat: " + Math.round(data.totalNutrients.FAPU.quantity) + " grams</p>";
        var fatMonoDisplay = "<p> Total Monounsaturated Fat: " + Math.round(data.totalNutrients.FAMS.quantity) + " grams</p>";
        // var fatTrnDisplay = "<p> Total Trans Fat: " + Math.round(data.totalNutrients.FATRN.quantity) + " grams</p>";
        var carbsDisplay = "<p> Total Carbs: " + Math.round(data.totalNutrients.CHOCDF.quantity) + " grams</p>";
        $("#nutrition-modal-body").append(calDisplay, fatDisplay, fatSatDisplay, fatPolyDisplay, fatMonoDisplay, carbsDisplay);   
    },
    'error': function(data) {
        successmessage = 'Error';
        $("label#successmessage").text(successmessage);
    },
  });
}

