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
  
  var currentUserCustomRecipes = null;

  var dbState;
  var tempUserName;

  database.ref().once("value", function(snapshot){
    dbState = snapshot;
});





$(document).on("click", "#fav-recipe-img-button, #fav-recipe-nav-btn", function(){
  currentUserRecipes.once("value", function(snapshot){
    snapshot.forEach((child) => {
      console.log(child.val().recipe_name, 'recipe id', child.val().recipe_id);
      displaySavedRecipes(child.val().recipe_name, child.val().recipe_id, child.val().recipe_url, child.val().recipe_image );
    });
  });
  currentUserCustomRecipes.once("value", function(snapshot){
    snapshot.forEach((child) => {
      displaySavedCustomRecipes(child.val().recipe_name, child.val().ingredients);
    })
  });
});




function displaySavedCustomRecipes(name, ingredients) {
  $.ajax({
    url: "https://api.giphy.com/v1/gifs/translate",
    method: "GET",
    data: {"api_key" : "BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9",
    "s": name,
    "weirdness": "10"}
  }).then(function(response){
    var randomPic;
    var results = response.data;
    randomPic = results.images.original.url;
    customCard = $("<div class='card'></div>");
    $(customCard).append("<img class='card-img-top' src='" + randomPic +"' alt=Card Image Cap>");
    $(customCard).append("<div class='card-body'></div>");
    $(customCard).append("<h5 class='card-title'>" + name + "</h5>");
    $(customCard).append("<h6 class='card-subtitle mb-2 text-muted'>" + 'You Custom Recipe' + "</h6>");
    $(customCard).append("<p class='card-text'>" + ingredients + "</p>");
    $("#recipe-search-wrapper").append(customCard);
  });
}


function displaySavedRecipes(rName, rID, rURL, rImageURL){

  $("#recipe-search-wrapper").empty();
  $(".recipe-search-container").removeClass("hidden")
  newCard = $("<div class='card'></div>");
  $(newCard).append("<img class='card-img-top' src='"+ rImageURL +"' alt=Card Image Cap>");
  $(newCard).append("<div class='card-body'>");
  $(newCard).append("<h5 class='card-title'>" + rName + "</h5>");
  $(newCard).append("<a href='" + rURL + "'>" + 'Explore Recipe' + "</a>");
  // $(newCard).append("<p class='card-text'>" + rURL + "</p>");
  $(newCard).append("<button id='" + rID + "' recipe-name='" + rName + "' class='recipe-btn btn btn-primary' data-toggle='modal' data-target='#recipeModal'>" + 'Click here to see the recipe' + "</button>");
  $("#recipe-search-wrapper").append(newCard);
}



$("#new-user-btn").on("click", function() {
  tempUserName = $("#new-user-input").val().toUpperCase().trim();
  if (!dbState.child("/" + tempUserName).exists()) {
    hideArea();
  currentUser = database.ref("/" +tempUserName );
  currentUserRecipes = database.ref("/" + tempUserName + "/recipes");
  currentUserCustomRecipes = database.ref("/" + tempUserName + "/custom-recipes");
  currentUser.set({
      username : $("#new-user-input").val().trim()
  });
  $("#users-name").text($("#existing-user-input").val().trim());
  } else {
    userAlert = $("<div class='alert alert-warning alert-dismissible fade show' role='alert'><strong>Username Already Exists</strong><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>");
    $(".landing-card").prepend(userAlert)
  };
});



$("#existing-user-btn").on("click", function() {
  tempUserName = $("#existing-user-input").val().toUpperCase().trim();
  console.log(tempUserName);
  if (dbState.child("/" + tempUserName).exists()) {
    hideArea();
      currentUser = database.ref("/" + tempUserName);
      currentUserRecipes = database.ref("/" + tempUserName + "/recipes");
      currentUserCustomRecipes = database.ref("/" + tempUserName + "/custom-recipes") ;
      console.log('you are "logged in"');
      $("#users-name").text($("#existing-user-input").val().trim());
  } else {
    userAlert = $("<div class='alert alert-warning alert-dismissible fade show' role='alert'><strong>Username Not Found</strong><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>");
    $(".landing-card").prepend(userAlert);
    // alert("Username not found");
  } 
    
});

if (currentUser !== null){
currentUser.on("value", function(snapshot){
  dbState = snapshot;
}
)}


//   Food2Fork API Key (Main): 6c25094e2b7ba0e57995415ce749ed94
//   Second Test API Key: b11d8301b0ecfac319569f557e520e48

var key = "6c25094e2b7ba0e57995415ce749ed94"





// Food2Fork Search API Call
function retreiveRecipes() {
    event.preventDefault();
  if( $(this).is("#recipe-nav-search-btn")) {
    searchTerm = $("#nav-recipe-search").val();
  } else {
    searchTerm = $("#recipe-search").val();
  }
    var queryURL = "https://www.food2fork.com/api/search?key=" + key + "&q=" + searchTerm;
    //smooth scroll to the searched recipes area.
    $('html, body').animate({
      scrollTop: $("#recipe-search-display").offset().top
  }, 800);

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
$("#recipe-search-wrapper").empty();
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
      .append("<p> Popularity Rank: " + (newRecipes[i].social_rank).toFixed(3) + "</p>");
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
  var recipeTitle= "";
  recipeTitle = $(".form-title").val();
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
  console.log(customRecipedata);
  currentUserCustomRecipes.push({
    recipe_name: customRecipedata.title,
    ingredients: customRecipedata.ingr
  });
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
 results = null;
    });



//Added call to display calorie data   
displayCaloriesJSON (recipeIngredients,results.recipe.title);

}

function hideArea() {
  event.preventDefault();
 $(".landing-container").addClass("d-none");
 $(".recipe-area-container").removeClass("hidden");
}



// Sticky Nav: When it is at top, make visible
var distance = 750;
$(window).scroll(function() {
    if ( $(this).scrollTop() >= distance ) {
        $("#sticky-nav").removeClass("hidden-nav");
        $("#sticky-nav").addClass("visible-nav");
    } else {
      $("#sticky-nav").removeClass("visible-nav");
      $("#sticky-nav").addClass(" fixed-top hidden-nav");
    }
});

  function scrolltoCustomRecipeArea() {
    $('html, body').animate({
      scrollTop: $("#custom-recipe-container").offset().top
  }, 800);
  }

  $(document).on("click", "#recipe-img-button, #recipe-nav-custom-btn", scrolltoCustomRecipeArea);
  $(document).on("click", ".recipe-btn", retrieveSingleRecipe);
  $(document).on("click", ".form-close", dismissIngredient);
  $(document).on("click", "#saveUserRecipe", saveUserRecipe);
  $(document).on("click", "#top-recipe-img-button, #top-recipe-nav-btn", retreiveRecipes);
  $(document).on("click", "#recipe-search-btn, #recipe-nav-search-btn", retreiveRecipes);
  // $(document).on("click", "#new-user-btn", hideArea);
  // $(document).on("click", "#existing-user-btn", hideArea);




//Retrieve Nutrition Data for single ingredient

 function displayCaloriesJSON(recipeIngredients, title){
  $("#nutrition-modal-body").empty();

  var data = {
    title: title,
    ingr: recipeIngredients
  }; 

var  url = 'https://api.edamam.com/api/nutrition-details?app_id=fca693b2&app_key=d8f84042894a6b3d6e6e9be1aef536b4'
   $.ajax({
      'type': 'POST',
      'url': url,
      'contentType': 'application/json',
      'data': JSON.stringify(data),
      'dataType': 'json',
      'success': function(data) {
        console.log(data);

      // var NutritionalData =  $("<table>");
      // NutritionalData.attr("class", "table");
      // NutritionalData.append("");
      displayNutrition(data);

    },
    'error': function(data) {

      console.log("Nothing!!!")

    },
  });
}



function displayNutrition (data) {

console.log(data);

  var result = {
 
    yield: data.yield  ? data.yield: 0 ,
    calories: data.calories  ? data.calories: 0 ,
    categories: {
    fat: {
      label: "Fat",
      totalNutrients:
        data.totalNutrients.FAT.quantity  ? data.totalNutrients.FAT.quantity : 0,
      totalDaily:
        data.totalDaily.FAT.totalDaily  ? data.totalDaily.FAT.quantity : 0,
        subcategory: 0
    },
    FASAT: {
      label: "Saturated",
      totalNutrients:
        data.totalNutrients.FASAT.quantity  ? data.totalNutrients.FASAT.quantity : 0,
      totalDaily:
        data.totalDaily.FASAT ? data.totalDaily.FASAT.quantity : 0,
        subcategory: 1
    },
    FATRN: {
      label: "Trans Fat",
      totalNutrients:
        data.totalNutrients.FATRN.quantity  ? data.totalNutrients.FATRN.quantity : 0,
      totalDaily:
        data.totalDaily.FATRN  ? data.totalDaily.FATRN.quantity : 0,
        subcategory: 1
    },
    FAMS: {
      label: "Monounsaturated",
      totalNutrients:
        data.totalNutrients.FAMS.quantity  ? data.totalNutrients.FAMS.quantity : 0,
      totalDaily:
        data.totalDaily.FAMS ? data.totalDaily.FAMS.quantity : 0,
        subcategory: 1
    },
    FAPU: {
      label: "Polyunsaturated",
      totalNutrients:
        data.totalNutrients.FAMS.quantity  ? data.totalNutrients.FAMS.quantity : 0,
      totalDaily:
        data.totalDaily.FAMS  ? data.totalDaily.FAMS.quantity : 0,
        subcategory: 1
    },
    carbs: {
      label: "Carbohydrate",
      totalNutrients:
        data.totalNutrients.CHOCDF.quantity  ? data.totalNutrients.CHOCDF.quantity : 0,
      totalDaily:
        data.totalDaily.CHOCDF  ? data.totalDaily.CHOCDF.quantity : 0,
        subcategory: 0
    },
    SUGAR: {
      label: "Sugars",
      totalNutrients:
        data.totalNutrients.SUGAR.quantity  ? data.totalNutrients.SUGAR.quantity : 0,
      totalDaily:
        data.totalDaily.SUGAR  ? data.totalDaily.SUGAR.quantity : 0,
        subcategory: 1
    },
    FIBTG: {
      label: "Fibre",
      totalNutrients:
        data.totalNutrients.FIBTG.quantity  ? data.totalNutrients.FIBTG.quantity : 0,
      totalDaily:
        data.totalDaily.FIBTG  ? data.totalDaily.FIBTG.quantity : 0,
        subcategory: 1
    },
    NA: {
      label: "Sodium",
      totalNutrients:
        data.totalNutrients.NA.quantity  ? data.totalNutrients.NA.quantity : 0,
      totalDaily:
        data.totalDaily.NA  ? data.totalDaily.NA.quantity : 0,
        subcategory: 0
    },
    CHOLE: {
      label: "Cholestrol",
      totalNutrients:
        data.totalNutrients.CHOLE.quantity  ? data.totalNutrients.CHOLE.quantity : 0,
      totalDaily:
        data.totalDaily.CHOLE  ? data.totalDaily.CHOLE.quantity : 0,
        subcategory: 0
    },
    PROCNT: {
      label: "Protein",
      totalNutrients:
        data.totalNutrients.PROCNT.quantity  ? data.totalNutrients.PROCNT.quantity : 0,
      totalDaily:
        data.totalDaily.PROCNT  ? data.totalDaily.PROCNT.quantity : 0,
        subcategory: 0
    }
    }

  };

  var tableDiv= $("<div>").attr("class", " table-responsive table-bordered table-hover" );
  var tableBody = $("<tbody>"); 
  var nutritionalTable = $("<table>").append(tableBody);
  nutritionalTable.attr("id","nutitritionTable") 
  .attr("class", "table")

   yieldDisplay=   $("<h3>").html('<th colspan="3"> Servings :' + result.yield + "</th>");
     calDisplay=   $("<h3>").html('<th colspan="3"> Calories:' + result.calories + "</th>");  

  for (let key in result.categories) {

    let value = result.categories[key];
    console.log(key, value);

    if(key.subcategory === 0){

    var newRow = $("<tr>")
      .html('<th scope="col"> <b>' + value.label + '</b>  '
        + Math.round(value.totalNutrients)
        + '</th> <td>'
        + Math.round(value.totalDaily) +'%'+ '</td>');
     newRow.addClass("Main-Category");   
     
    }

    else{
      
    var newRow = $("<tr>")
    .html('<th scope="col">' + value.label + '  '
      + Math.round(value.totalNutrients)
      + '</th> <td>'
      + Math.round(value.totalDaily) +'%'+ '</td>');
      newRow.addClass("Sub-Category"); 
    }
    nutritionalTable.append(newRow);
    
  }
  $(tableDiv).append(nutritionalTable);
  $("#nutrition-modal-body").append(yieldDisplay, calDisplay, tableDiv);
  


}

