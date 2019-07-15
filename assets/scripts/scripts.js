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
});


function displaySavedRecipes(rName, rID, rURL, rImageURL){

  $("#recipe-search-wrapper").empty();
  $(".recipe-search-container").removeClass("hidden")
  newCard = $("<div class='card'></div>");
  $(newCard).append("<img class='card-img-top' src='"+ rImageURL +"' alt=Card Image Cap>");
  $(newCard).append("<div class='card-body'>");
  $(newCard).append("<h5 class='card-title'>" + rName + "</h5>");
  $(newCard).append("<p class='card-text'>" + rURL + "</p>");
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
  } else alert('Username Already Exists');
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
  } else alert("Username not found");
});

if (currentUser !== null){
currentUser.on("value", function(snapshot){
  dbState = snapshot;
}
)}


//   Food2Fork API Key (Main): 6c25094e2b7ba0e57995415ce749ed94
//   Second Test API Key: b11d8301b0ecfac319569f557e520e48

var key = "2fe943e19f2274574012873be158e1e3"





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
    ingrents: customRecipedata.ingr
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
 results= null;
    });



//Added call to display Edamam data   
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




//Retrieve Nutrition Data for recipe

 function displayCaloriesJSON(recipeIngredients, title){
  $("#nutrition-modal-body").empty();

  var data = {
    title: title,
    ingr: recipeIngredients
  }; 

  var appID  = '2c72283c';
  var appkey  = '4930a8654583355204b5c2c1e7a61d18';
  
  
  var  url = 'https://api.edamam.com/api/nutrition-details?app_id=' + appID +'&app_key=' +appkey ;  
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

      $("#nutrition-modal-body").html("<p>Nutrition Data not available for this recipe!</p>");

    },
  });
}



function displayNutrition (data) {

console.log(data);

  var servings = 0;
  var calories = 0;
  var fatQuantity = 0;
  var  fatLabel = "Fat";
  var    fatUnit =  "g";
  var fatPercentDaily = 0;
  var FATRNQuantity = 0;
  var FATRNUnit = "g";
  var  FATRNLabel = "Trans";
  var FATRNPercentDaily = 0;
  var FASATQuantity = 0;
  var FASATUnit = "g";
  var  FASATLabel = "Saturated";
  var FASATPercentDaily = 0;
  var FAMSQuantity = 0;
  var  FAMSLabel = "Monounsaturated";
  var FAMSPercentDaily = 0;
  var FAMSUnit = "g";
  var FAPUQuantity = 0;
  var FAPUUnit = "g";
  var FAPUPercentDaily = 0;
  var FAPULabel = "Polyunsaturated";
  var CHOCDFQuantity = 0;
  var CHOCDFUnit = "g";
  var CHOCDFPercentDaily = 0;
  var CHOCDFLabel = "Carbs";
  var FIBTGQuantity = 0;
  var FIBTGUnit = "g";
  var FIBTGPercentDaily = 0;
  var FIBTGLabel = "Fibre";
  var SUGARQuantity = 0;
  var SUGARUnit = "g";
  var SUGARLabel = "Sugars";
  var SUGARPercentDaily = 0;
  var PROCNTQuantity = 0;
  var PROCNTUnit = "g";
  var PROCNTLabel = "Protein";
  var PROCNTPercentDaily = 0;
  var CHOLEQuantity = 0;
  var CHOLEUnit = "mg";
  var CHOLELabel = "Cholesterol";
  var CHOLEPercentDaily = 0;
  var NAQuantity = 0;
  var NALabel = "Sodium";
  var NAUnit = "mg";
  var NAPercentDaily = 0;
  var CAQuantity = 0;
  var CAUnit = "mg";
  var CALabel = "Calcium";
  var CAPercentDaily = 0;
  var FEQuantity = 0;
  var FEUnit = '';
  var FEPercentDaily = 0;
  var FELabel = "Iron";
  var VITA_RAEQuantity = 0;
  var VITA_RAEUnit = '';
  var VITA_RAEPercentDaily = 0;
  var VITA_RAELabel = "Vitamin A";
  var VITCQuantity = 0;
  var VITCUnit = '';
  var VITCPercentDaily = 0;
  var  VITCLabel = "Vitamin C";
  var VITKQuantity = 0;
  var VITKUnit = '';
  var VITKPercentDaily = 0;
  var  VITKLabel = "Vitamin K";
  var VITDQuantity = 0;
  var VITDUnit = '';
  var VITDPercentDaily = 0;
  var VITDLabel = "Vitamin D";
  var VITB12Quantity = 0;
  var VITB12Unit = '';
  var VITB12PercentDaily = 0;
  var VITB12Label = "Vitamin B12";
  var VITB6Quantity = 0;
  var VITB6Unit = '';
  var VITB6PercentDaily = 0;
  var VITB6Label = "Vitamin B6";
 
  console.log("I don't need to log this");

  //Serving Size 
  if (typeof data.yield !== 'undefined' && data.yield !== null) {
    servings = data.yield;
    console.log(servings);

    //Total Calories  
    if (typeof data.calories  !== 'undefined' && data.calories  !== null) {
      calories = data.calories;

      //Total Fat
      if (typeof data.totalNutrients.FAT  !== 'undefined' && data.totalNutrients.FAT   !== null)
      {  fatQuantity = Math.round(data.totalNutrients.FAT.quantity) ;
      if (typeof data.totalDaily.FAT  !== 'undefined' && data.totalDaily.FAT   !== null)
      {  fatPercentDaily = Math.round(data.totalDaily.FAT.quantity); } else{fatPercentDaily = ""}
      }   else{fatQuantity = ""; fatUnit =  "";}
      
      //Total Saturated Fat
      if (typeof data.totalNutrients.FASAT  !== 'undefined' && data.totalNutrients.FASAT   !== null)
      { FASATQuantity = Math.round(data.totalNutrients.FASAT.quantity) ;  
      if (typeof data.totalDaily.FASAT  !== 'undefined' && data.totalDaily.FASAT   !== null)
      {  FASATPercentDaily = Math.round(data.totalDaily.FASAT.quantity) ;}  else{FASATPercentDaily = ""}
      }  else{FASATQuantity = ""; FASATUnit =  "";}

      //Trans Fat
      if (typeof data.totalNutrients.FATRN  !== 'undefined' && data.totalNutrients.FATRN   !== null)
      {       FATRNQuantity = Math.round(data.totalNutrients.FATRN.quantity) ;   
      if (typeof data.totalDaily.FATRN  !== 'undefined' && data.totalDaily.FATRN   !== null)
      {  FATRNPercentDaily = Math.round(data.totalDaily.FATRN.quantity) ;}  else{FATRNPercentDaily = ""}
      } else{  FATRNQuantity = ""; FATRNUnit =  "";}

      //Monounsaturated Fat       
      if (typeof data.totalNutrients.FAMS !== 'undefined' && data.totalNutrients.FAMS  !== null)
      {      FAMSQuantity = Math.round(data.totalNutrients.FAMS.quantity ) ;
          
      if (typeof data.totalDaily.FAMS !== 'undefined' && data.totalDaily.FAMS  !== null)
      {FAMSPercentDaily = Math.round(data.totalDaily.FAMS.quantity) ;}  else{FAMSPercentDaily = ""}
      } else{  FAMSQuantity = ""; FAMSUnit =  "";}

      //Polyunsaturated Fat     
      if (typeof data.totalNutrients.FAPU  !== 'undefined'  &&  data.totalNutrients.FAPU   !== null)
      {      FAPUQuantity = Math.round(data.totalNutrients.FAPU.quantity ) ;
  
      if (typeof data.totalDaily.FAPU !== 'undefined' && data.totalDaily.FAPU  !== null)
      {FAPUPercentDaily = Math.round(data.totalDaily.FAPU.quantity) ;}  else{FAPUPercentDaily = ""}
      } else{  FAPUQuantity = ""; FAPUUnit =  "";}

      //Carbs
      if (typeof data.totalNutrients.CHOCDF  !== 'undefined'  &&  data.totalNutrients.CHOCDF   !== null)
      {      CHOCDFQuantity = Math.round(data.totalNutrients.CHOCDF.quantity ) ;
     
      if (typeof data.totalDaily.CHOCDF !== 'undefined' && data.totalDaily.CHOCDF  !== null)
      {CHOCDFPercentDaily = Math.round(data.totalDaily.CHOCDF.quantity) ;}  else{CHOCDFPercentDaily = ""}
      } else{  CHOCDFQuantity = ""; CHOCDFUnit =  "";}

        //Sugar
       if (typeof data.totalNutrients.SUGAR  !== 'undefined' &&  data.totalNutrients.SUGAR   !== null)
       {      SUGARQuantity = Math.round(data.totalNutrients.SUGAR.quantity ) ;
     
        if (typeof data.totalDaily.SUGAR !== 'undefined' && data.totalDaily.SUGAR  !== null)
        {SUGARPercentDaily = Math.round(data.totalDaily.SUGAR.quantity) ;}  else{SUGARPercentDaily = ""}
        } else{  SUGARQuantity = ""; SUGARUnit =  "";}

        //Fiber
        if (typeof data.totalNutrients.FIBTG  !== 'undefined'  &&  data.totalNutrients.FIBTG   !== null)
        {      FIBTGQuantity = Math.round(data.totalNutrients.FIBTG.quantity ) ;
       
        if (typeof data.totalDaily.FIBTG !== 'undefined' && data.totalDaily.FIBTG  !== null)
        {FIBTGPercentDaily = Math.round(data.totalDaily.FIBTG.quantity) ;}  else{FIBTGPercentDaily = ""}
        } else{  FIBTGQuantity = ""; FIBTGUnit =  "";}

        //Protein
        if (typeof data.totalNutrients.PROCNT  !== 'undefined'  &&  data.totalNutrients.PROCNT   !== null)
        {      PROCNTQuantity = Math.round(data.totalNutrients.PROCNT.quantity ) ;
      
        if (typeof data.totalDaily.PROCNT !== 'undefined' && data.totalDaily.PROCNT  !== null)
        {PROCNTPercentDaily = Math.round(data.totalDaily.PROCNT.quantity) ;}  else{PROCNTPercentDaily = ""}
        } else{  PROCNTQuantity = ""; PROCNTUnit =  "";}

        //Cholestrol  
        if (typeof data.totalNutrients.CHOLE  !== 'undefined'  &&  data.totalNutrients.CHOLE   !== null)
        {      CHOLEQuantity = Math.round(data.totalNutrients.CHOLE.quantity ) ;
   
        if (typeof data.totalDaily.CHOLE !== 'undefined' && data.totalDaily.CHOLE  !== null)
        {CHOLEPercentDaily = Math.round(data.totalDaily.CHOLE.quantity) ;}  else{CHOLEPercentDaily = ""}
        } else{  CHOLEQuantity = ""; CHOLEUnit =  "";}

        //Sodium
        if (typeof data.totalNutrients.NA  !== 'undefined'  &&  data.totalNutrients.NA   !== null)
        {      NAQuantity = Math.round(data.totalNutrients.FAPU.quantity ) ;
     
        if (typeof data.totalDaily.NA !== 'undefined' && data.totalDaily.NA  !== null)
        {NAPercentDaily = Math.round(data.totalDaily.NA.quantity) ;}  else{NAPercentDaily = ""}
        } else{  NAQuantity = ""; NAUnit =  "";}

        //Calcium
        if (typeof data.totalNutrients.CA  !== 'undefined'  &&  data.totalNutrients.CA   !== null)
        {      CAQuantity = Math.round(data.totalNutrients.CA.quantity ) ;
        CAUnit =  "mg";
        if (typeof data.totalDaily.CA !== 'undefined' && data.totalDaily.CA  !== null)
        {CAPercentDaily = Math.round(data.totalDaily.CA.quantity) ;}  else{CAPercentDaily = ""}
        }   else{  CAQuantity = ""; CAUnit =  "";}

        //Iron
        if (typeof data.totalNutrients.FE  !== 'undefined'  &&  data.totalNutrients.FE   !== null)
        {      FEQuantity = Math.round(data.totalNutrients.FE.quantity ) ;
        FEUnit =  "mg";
        if (typeof data.totalDaily.FE !== 'undefined' && data.totalDaily.FE  !== null)
        {FEPercentDaily = Math.round(data.totalDaily.FE.quantity) ;} else{FEPercentDaily = ""}
        } else{  FEQuantity = ""; FEUnit =  "";}

        //Vitamin C
        if (typeof data.totalNutrients.VITC  !== 'undefined'  &&  data.totalNutrients.VITC   !== null)
        {      VITCQuantity = Math.round(data.totalNutrients.VITC.quantity ) ;
       
        VITCUnit =  "mg";
        if (typeof data.totalDaily.VITC !== 'undefined' && data.totalDaily.VITC  !== null)
        {VITCPercentDaily = Math.round(data.totalDaily.VITC.quantity) ;}  else{VITCPercentDaily = ""}
        } else{  VITCQuantity = ""; VITCUnit =  "";}

        //Vitamin D
        if (typeof data.totalNutrients.VITD  !== 'undefined'  &&  data.totalNutrients.VITD   !== null)
        {      VITDQuantity = Math.round(data.totalNutrients.VITD.quantity ) ;
       
        VITDUnit =  "mg";
        if (typeof data.totalDaily.VITD !== 'undefined' && data.totalDaily.VITD  !== null)
        {VITDPercentDaily = Math.round(data.totalDaily.VITD.quantity) ;}  else{VITDPercentDaily = ""}
        } else{  VITDQuantity = ""; VITDUnit =  "";}

        //Vitamin K
        if (typeof data.totalNutrients.VITK1  !== 'undefined'  &&  data.totalNutrients.VITK1   !== null)
        {      VITKQuantity = Math.round(data.totalNutrients.VITK1.quantity ) ;
       
        VITKUnit =  "mg";
        if (typeof data.totalDaily.VITK1 !== 'undefined' && data.totalDaily.VITK1  !== null)
        {VITKPercentDaily = Math.round(data.totalDaily.VITK1.quantity) ;}  else{VITKPercentDaily = ""}
        } else{  VITKQuantity = ""; VITKUnit =  "";}

        //Vitamin B12
        if (typeof data.totalNutrients.VITB12  !== 'undefined'  &&  data.totalNutrients.VITB12   !== null)
        {      VITKQuantity = Math.round(data.totalNutrients.VITB12.quantity ) ;
       
          VITB12Unit =  data.totalNutrients.VITB12.unit;
        if (typeof data.totalDaily.VITB12 !== 'undefined' && data.totalDaily.VITB12  !== null)
        {VITKPercentDaily = Math.round(data.totalDaily.VITB12.quantity) ;}  else{VITKPercentDaily = ""}
        } else{  VITB12Quantity = ""; VITB12Unit =  "";}

        //Vitamin B6
        if (typeof data.totalNutrients.VITB6A  !== 'undefined'  &&  data.totalNutrients.VITB6A   !== null)
        {      VITB6Quantity = Math.round(data.totalNutrients.VITB6A.quantity ) ;
       
          VITB6Unit =  data.totalNutrients.VITB6A.unit;
        if (typeof data.totalDaily.VITB6A !== 'undefined' && data.totalDaily.VITB6A  !== null)
        {VITB6PercentDaily = Math.round(data.totalDaily.VITB6A.quantity) ;}  else{VITB6PercentDaily = ""}
        } else{  VITB6Quantity = ""; VITB6Unit =  "";}

        //VITA_RAE
        if (typeof data.totalNutrients.VITA_RAE  !== 'undefined'  &&  data.totalNutrients.VITA_RAE   !== null)
        {      VITA_RAEQuantity = Math.round(data.totalNutrients.VITA_RAE.quantity ) ; 
  
        VITA_RAEUnit =  data.totalNutrients.VITA_RAE.unit;
        if (typeof data.totalDaily.VITA_RAE !== 'undefined' && data.totalDaily.VITA_RAE  !== null)
        {VITA_RAEPercentDaily = Math.round(data.totalDaily.VITA_RAE.quantity) ;}  else{VITA_RAEPercentDaily = ""}
        } else{  VITA_RAEQuantity = ""; VITA_RAEUnit =  "";}


  } 
  else{ calories = 0;}

  } 
  else{ servings = 0;}


//Create table, headers
var tableDiv= $("<div>").attr("class", " table-responsive table-bordered" );

var tableHead = $("<thead>"); 
var nutritionalTable = $("<table>")
nutritionalTable.attr("id","nutitritionTable") 
.attr("class", "table")
tableBody = $("<tbody>")

//Calorie Display
calDisplay=   $("<tr>").html('<th id="calDisplay">  Calories: ' + calories+ '</th>' + 
'<td id="dailyPercentage"> % Daily Value </td>' );  


//Append Calories, Servings and DailyPercent headers 
tableHead.append(calDisplay)


//Display Total Fat 
fatDisplay =  $('<tbody>').html('<tr class="maininfo">'+'<th scope="col">' + fatLabel + ' ' + fatQuantity+ ' ' + fatUnit +
' <i class="fa fa-plus clickable"  id="icon1" data-toggle="collapse" data-target="#group-of-rows-1"></i>' +'</th> <td class="percentage"> '   + fatPercentDaily +'%'+ '</td>');

//Fat subs
FASATDisplay =  $("<tr>").html(' <th scope="col" class="subinfo">' + FASATLabel + ' ' + FASATQuantity+ ' ' + FASATUnit +'</th> <td class="percentage"> ' + FASATPercentDaily +'%'+ '</td>');
FATRNDisplay =  $("<tr>").html(' <th scope="col" class="subinfo">' + FATRNLabel + ' ' + FATRNQuantity+ ' ' + FATRNUnit +'</th> <td class="percentage"> '   + FATRNPercentDaily +'%'+ '</td>');
FAMSDisplay =  $("<tr>").html(' <th scope="col" class="subinfo">' + FAMSLabel + ' ' + FAMSQuantity+ ' ' + FAMSUnit +'</th> <td class="percentage"> '   + FAMSPercentDaily +'%'+ '</td>');
FAPUDisplay =  $("<tr>").html(' <th scope="col" class="subinfo">' + FAPULabel + ' ' + FAPUQuantity+ ' ' + FAPUUnit +'</th> <td class="percentage"> '   + FAPUPercentDaily +'%'+ '</td>');
////Make the field collapsible
FatSubsDisplay = $("<tbody>").attr("id",'group-of-rows-1').addClass("collapse").append(FASATDisplay,FATRNDisplay,FAMSDisplay ,FAPUDisplay)

//Display Total Carbs
CHOCDFDisplay =  $('<tbody>').html('<tr class="maininfo">'+'<th scope="col">' + CHOCDFLabel + ' ' + CHOCDFQuantity+ ' ' + CHOCDFUnit+ 
' <i class="fa fa-plus clickable" data-toggle="collapse" data-target="#group-of-rows-2"  id="icon2"></i>' +'</th> <td class="percentage"> ' + CHOCDFPercentDaily +'%'+ '</td>');

//carbs subs
SUGARDisplay =  $("<tr>").html(' <th scope="col" class="subinfo">' + SUGARLabel + ' ' + SUGARQuantity+ ' ' + SUGARUnit +'</th> <td class="percentage"> '   + SUGARPercentDaily +'%'+ '</td>');
FIBTGDisplay =  $("<tr>").html(' <th scope="col" class="subinfo">' + FIBTGLabel + ' ' + FIBTGQuantity+ ' ' + FIBTGUnit +'</th> <td class="percentage"> '   + FIBTGPercentDaily +'%'+ '</td>');  
//Make the field collapsible
CHOCDFSubsDisplay = $("<tbody>").attr("id",'group-of-rows-2').addClass("collapse").append(SUGARDisplay,FIBTGDisplay)


CHOLEDisplay =  $("<tr>").html('<th scope="col">  ' + CHOLELabel + ' ' + CHOLEQuantity+ ' ' + CHOLEUnit +'</th> <td class="percentage"> '  + CHOLEPercentDaily +'%'+ '</td>').addClass("maininfo");
PROCNTDisplay =  $("<tr>").html('<th scope="col">' + PROCNTLabel + ' ' + PROCNTQuantity+ ' ' + PROCNTUnit +'</th> <td class="percentage"> '  + PROCNTPercentDaily +'%'+ '</td>').addClass("maininfo");

NADisplay =  $("<tr>").html('<th scope="col">  ' + NALabel + ' ' + NAQuantity + NAUnit+ ' ' +'</th> <td class="percentage"> '  + NAPercentDaily +'%'+ '</td>').addClass("maininfo");
CADisplay =  $("<tr>").html('<th scope="col" class="main">' + CALabel + ' ' + CAQuantity+ ' ' + CAUnit +'</th> <td class="percentage"> '  + CAPercentDaily +'%'+ '</td>');
FEDisplay =  $("<tr>").html('<th scope="col" class="maininfo">' + FELabel + ' ' + FEQuantity+ ' ' + FEUnit +'</th> <td class="percentage"> ' + FEPercentDaily +'%'+ '</td>');  

vitDisplay =  $('<tbody>').html('<tr class="maininfo"> <th scope="col"> Vitamins'+ 
' <i class="fa fa-plus clickable" data-toggle="collapse" data-target="#group-of-rows-3"  id="icon3"></i>'+'</th> <td class="percentage"> </td>')

  VITCDisplay =  $("<tr>").html('<th scope="col" class="subinfo">' + VITCLabel + ' ' + VITCQuantity+ ' ' + VITCUnit +'</th> <td class="percentage"> '+ VITCPercentDaily +'%'+ '</td>');
  VITA_RAEDisplay =  $("<tr>").html('<th scope="col" class="subinfo">' + VITA_RAELabel + ' ' + VITA_RAEQuantity+ ' ' + VITA_RAEUnit +'</th> <td class="percentage"> ' + VITA_RAEPercentDaily +'%'+ '</td>');
  VITDDisplay =  $("<tr>").html('<th scope="col" class="subinfo">' + VITDLabel + ' ' + VITDQuantity + ' '+ VITDUnit +'</th> <td class="percentage"> ' + VITDPercentDaily +'%'+ '</td>');
  VITKDisplay =  $("<tr>").html('<th scope="col" class="subinfo">' + VITKLabel + ' ' + VITKQuantity + ' '+ VITKUnit +'</th> <td class="percentage"> ' + VITKPercentDaily +'%'+ '</td>');
  VITB12Display =  $("<tr>").html('<th scope="col" class="subinfo">' + VITB12Label + ' ' + VITB12Quantity + ' '+ VITB12Unit +'</th> <td class="percentage"> ' + VITB12PercentDaily +'%'+ '</td>');
  VITB6Display =  $("<tr>").html('<th scope="col" class="subinfo">' + VITB6Label + ' ' + VITB6Quantity + ' '+ VITB6Unit +'</th> <td class="percentage"> ' + VITB6PercentDaily +'%'+ '</td>');
  
  
  vitSubsDisplay = $("<tbody>").attr("id",'group-of-rows-3').addClass("collapse").append(VITCDisplay,VITA_RAEDisplay,VITDDisplay, VITKDisplay,VITB12Display,VITB6Display)
  
  
  tableBody.append(CHOLEDisplay, PROCNTDisplay
    ,NADisplay)
    // , CADisplay, FEDisplay)
  
    nutritionalTable.append(tableHead,tableBody,fatDisplay, FatSubsDisplay,CHOCDFDisplay, CHOCDFSubsDisplay, tableBody,vitDisplay,vitSubsDisplay);
  
  $(tableDiv).append(nutritionalTable);
  $("#nutrition-modal-body").append(tableDiv); 

}

$(document).on("click", ".clickable", changeIcon);

function changeIcon(){
if( $(this).hasClass("fa-plus") )
{   $(this).addClass("fa-minus").removeClass("fa-plus");   
    $(this).parent().parent().addClass("expanded");
}
else{$(this).addClass("fa-plus").removeClass("fa-minus") 
$(this).parent().parent().removeClass("expanded");
}
}