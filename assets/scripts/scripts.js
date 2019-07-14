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

var key = "49d0a6d68d5cc628b7d10db08a79038e"





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
  var fatLabel = '';
  var fatUnit = '';
  var fatPercentDaily = 0;
  var FATRNQuantity = 0;
  var FATRNUnit = '';
  var FATRNLabel = '';
  var FATRNPercentDaily = 0;
  var FASATQuantity = 0;
  var FASATUnit = '';
  var FASATLabel = '';
  var FASATPercentDaily = 0;
  var FAMSQuantity = 0;
  var FAMSUnit = '';
  var FAMSPercentDaily = 0;
  var FAMSLabel = '';
  var FAPUQuantity = 0;
  var FAPUUnit = '';
  var FAPUPercentDaily = 0;
  var FAPULabel = '';
  var CHOCDFQuantity = 0;
  var CHOCDFUnit = '';
  var CHOCDFPercentDaily = 0;
  var CHOCDFLabel = '';
  var FIBTGQuantity = 0;
  var FIBTGUnit = '';
  var FIBTGPercentDaily = 0;
  var FIBTGLabel = '';
  var SUGARQuantity = 0;
  var SUGARUnit = '';
  var SUGARLable = 0;
  var SUGARPercentDaily = 0;
  var PROCNTQuantity = 0;
  var PROCNTUnit = '';
  var PROCNTLabel = '';
  var PROCNTPercentDaily = 0;
  var CHOLEQuantity = 0;
  var CHOLEUnit = '';
  var CHOLELabel = '';
  var CHOLEPercentDaily = 0;
  var NAQuantity = 0;
  var NALabel = '';
  var NAUnit = '';
  var NAPercentDaily = 0;
  var CAQuantity = 0;
  var CAUnit = '';
  var CALabel = '';
  var CAPercentDaily = 0;
  var FEQuantity = 0;
  var FEUnit = '';
  var FEPercentDaily = 0;
  var FELabel = '';
  var VITA_RAEQuantity = 0;
  var VITA_RAEUnit = '';
  var VITA_RAEPercentDaily = 0;
  var VITA_RAELabel = '';
  var VITCQuantity = 0;
  var VITCUnit = '';
  var VITCPercentDaily = 0;
  var VITCLabel = '';

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
      fatLabel = "Fat";
      fatUnit =  "g";
      if (typeof data.totalDaily.FAT  !== 'undefined' && data.totalDaily.FAT   !== null)
      {  fatPercentDaily = Math.round(data.totalDaily.FAT.quantity); }
      } else{ console.log("N/A")}

      //Total Saturated Fat
      if (typeof data.totalNutrients.FASAT  !== 'undefined' && data.totalNutrients.FASAT   !== null)
      { FASATQuantity = Math.round(data.totalNutrients.FASAT.quantity) ;
      FASATLabel = "Saturated";
      FASATUnit =  "g";
      if (typeof data.totalDaily.FASAT  !== 'undefined' && data.totalDaily.FASAT   !== null)
      {  FASATPercentDaily = Math.round(data.totalDaily.FASAT.quantity) ;} 
      } else{ console.log("N/A")}

      //Trans Fat
      if (typeof data.totalNutrients.FATRN  !== 'undefined' && data.totalNutrients.FATRN   !== null)
      {       FATRNQuantity = Math.round(data.totalNutrients.FATRN.quantity) ;
      FATRNLabel = "Trans";
      FATRNUnit =  "g";
      } else{ console.log("N/A")}

      //Monounsaturated Fat       
      if (typeof data.totalNutrients.FAMS !== 'undefined' && data.totalNutrients.FAMS  !== null)
      {      FAMSQuantity = Math.round(data.totalNutrients.FAMS.quantity ) ;
      FAMSLabel = "MonoUnsaturated";
      FAMSUnit =  "g";
      if (typeof data.totalDaily.FAMS !== 'undefined' && data.totalDaily.FAMS  !== null)
      {FAMSPercentDaily = Math.round(data.totalDaily.FAMS.quantity) ;}
      } else{ console.log("N/A")}  

      //Polyunsaturated Fat     
      if (typeof data.totalNutrients.FAPU  !== 'undefined'  &&  data.totalNutrients.FAPU   !== null)
      {      FAPUQuantity = Math.round(data.totalNutrients.FAPU.quantity ) ;
      FAPULabel = "Polyunsaturated";
      FAPUUnit =  "g";
      if (typeof data.totalDaily.FAPU !== 'undefined' && data.totalDaily.FAPU  !== null)
      {FAPUPercentDaily = Math.round(data.totalDaily.FAPU.quantity) ;}
      } else{ console.log("N/A")}  

      //Carbs
      if (typeof data.totalNutrients.CHOCDF  !== 'undefined'  &&  data.totalNutrients.CHOCDF   !== null)
      {      CHOCDFQuantity = Math.round(data.totalNutrients.CHOCDF.quantity ) ;
      CHOCDFLabel = "Carbs";
      CHOCDFUnit =  "g";
      if (typeof data.totalDaily.CHOCDF !== 'undefined' && data.totalDaily.CHOCDF  !== null)
      {CHOCDFPercentDaily = Math.round(data.totalDaily.CHOCDF.quantity) ;}
      } else{ console.log("N/A")}  

        //Sugar
       if (typeof data.totalNutrients.SUGAR  !== 'undefined' &&  data.totalNutrients.SUGAR   !== null)
       {      SUGARQuantity = Math.round(data.totalNutrients.SUGAR.quantity ) ;
        SUGARLabel = "Sugars";
        SUGARUnit =  "g";
        if (typeof data.totalDaily.SUGAR !== 'undefined' && data.totalDaily.SUGAR  !== null)
        {SUGARPercentDaily = Math.round(data.totalDaily.SUGAR.quantity) ;}
        } else{ console.log("N/A")}  

        //Fiber
        if (typeof data.totalNutrients.FIBTG  !== 'undefined'  &&  data.totalNutrients.FIBTG   !== null)
        {      FIBTGQuantity = Math.round(data.totalNutrients.FIBTG.quantity ) ;
        FIBTGLabel = "Fiber";
        FIBTGUnit =  "g";
        if (typeof data.totalDaily.FIBTG !== 'undefined' && data.totalDaily.FIBTG  !== null)
        {FIBTGPercentDaily = Math.round(data.totalDaily.FIBTG.quantity) ;}
        } else{ console.log("N/A")}  

        //Protein
        if (typeof data.totalNutrients.PROCNT  !== 'undefined'  &&  data.totalNutrients.PROCNT   !== null)
        {      PROCNTQuantity = Math.round(data.totalNutrients.PROCNT.quantity ) ;
        PROCNTLabel = "Protein";
        PROCNTUnit =  "g";
        if (typeof data.totalDaily.PROCNT !== 'undefined' && data.totalDaily.PROCNT  !== null)
        {PROCNTPercentDaily = Math.round(data.totalDaily.PROCNT.quantity) ;}
        } else{ console.log("N/A")}  

        //Cholestrol  
        if (typeof data.totalNutrients.CHOLE  !== 'undefined'  &&  data.totalNutrients.CHOLE   !== null)
        {      CHOLEQuantity = Math.round(data.totalNutrients.CHOLE.quantity ) ;
        CHOLELabel = "Cholestrol";
        CHOLEUnit =  "mg";
        if (typeof data.totalDaily.CHOLE !== 'undefined' && data.totalDaily.CHOLE  !== null)
        {CHOLEPercentDaily = Math.round(data.totalDaily.CHOLE.quantity) ;}
        } else{ console.log("N/A")}  

        //Sodium
        if (typeof data.totalNutrients.NA  !== 'undefined'  &&  data.totalNutrients.NA   !== null)
        {      NAQuantity = Math.round(data.totalNutrients.FAPU.quantity ) ;
        NALabel = "Sodium";
        NAUnit =  "mg";
        if (typeof data.totalDaily.NA !== 'undefined' && data.totalDaily.NA  !== null)
        {NAPercentDaily = Math.round(data.totalDaily.NA.quantity) ;}
        } else{ console.log("N/A")}  

        //Calcium
        if (typeof data.totalNutrients.CA  !== 'undefined'  &&  data.totalNutrients.CA   !== null)
        {      CAQuantity = Math.round(data.totalNutrients.CA.quantity ) ;
        CALabel = "Calcium";
        CAUnit =  "mg";
        if (typeof data.totalDaily.CA !== 'undefined' && data.totalDaily.CA  !== null)
        {CAPercentDaily = Math.round(data.totalDaily.CA.quantity) ;}
        } else{ console.log("N/A")}  

        //Iron
        if (typeof data.totalNutrients.FE  !== 'undefined'  &&  data.totalNutrients.FE   !== null)
        {      FEQuantity = Math.round(data.totalNutrients.FE.quantity ) ;
        FELabel = "Iron";
        FEUnit =  "mg";
        if (typeof data.totalDaily.FE !== 'undefined' && data.totalDaily.FE  !== null)
        {FEPercentDaily = Math.round(data.totalDaily.FE.quantity) ;}
        } else{ console.log("N/A")}  

        //Vitamin C
        if (typeof data.totalNutrients.VITC  !== 'undefined'  &&  data.totalNutrients.VITC   !== null)
        {      VITCQuantity = Math.round(data.totalNutrients.VITC.quantity ) ;
        VITCLabel = "Vitamin C";
        VITCUnit =  "mg";
        if (typeof data.totalDaily.VITC !== 'undefined' && data.totalDaily.VITC  !== null)
        {VITCPercentDaily = Math.round(data.totalDaily.VITC.quantity) ;}
        } else{ console.log("N/A")}  

        //VITA_RAE
        if (typeof data.totalNutrients.VITA_RAE  !== 'undefined'  &&  data.totalNutrients.VITA_RAE   !== null)
        {      VITA_RAEQuantity = Math.round(data.totalNutrients.VITA_RAE.quantity ) ;
        VITA_RAELabel = "Vitamin A";
        VITA_RAEUnit =  "µg";
        if (typeof data.totalDaily.VITA_RAE !== 'undefined' && data.totalDaily.VITA_RAE  !== null)
        {VITA_RAEPercentDaily = Math.round(data.totalDaily.VITA_RAE.quantity) ;}
        } else{ console.log("N/A")}  


  } 
  else{ calories = 0;}

  } 
  else{ servings = 0;}




  var tableDiv= $("<div>").attr("class", " table-responsive table-bordered table-hover" );
  var tableBody = $("<tbody>"); 
  var tableHead = $("<thead>"); 
  var nutritionalTable = $("<table>")
  nutritionalTable.attr("id","nutitritionTable") 
  .attr("class", "table")

  calDisplay=   $("<tr>").html(' Calories: ' + calories + "</th>");  
  calDisplay.attr("id","calDisplay");
  // calDisplay.addClass("col-2")
  
  yieldDisplay=   $("<tr>").html(' Servings per container: ' + servings + "</th>");
  yieldDisplay.attr("id","yieldDisplay");
  // calDisplay.addClass("col-2")

  dailyPercentage = $("<tr>").html("<td></td><td>% Daily Value </td>");
  dailyPercentage.attr("id","dailyPercentage");
  // calDisplay.addClass("col-2")
  tableHead.append(calDisplay,yieldDisplay,dailyPercentage)

  fatDisplay =  $("<tr>").html('<th scope="col" class="maininfo">' + fatLabel + ' ' + fatQuantity + fatUnit +'</th> <td class="percentage"> '   + fatPercentDaily +'%'+ '</td>');
  FASATDisplay =  $("<tr>").html(' <th scope="col" class="subinfo">' + FASATLabel + ' ' + FASATQuantity + FASATUnit +'</th> <td class="percentage"> ' + FASATPercentDaily +'%'+ '</td>');
  FATRNDisplay =  $("<tr>").html(' <th scope="col" class="subinfo">' + FATRNLabel + ' ' + FATRNQuantity + FATRNUnit +'</th> <td class="percentage"> '   + FATRNPercentDaily +'%'+ '</td>');
  FAMSDisplay =  $("<tr>").html(' <th scope="col" class="subinfo">' + FAMSLabel + ' ' + FAMSQuantity + FAMSUnit +'</th> <td class="percentage"> '   + FAMSPercentDaily +'%'+ '</td>');
  FAPUDisplay =  $("<tr>").html(' <th scope="col" class="subinfo">' + FAPULabel + ' ' + FAPUQuantity + FAPUUnit +'</th> <td class="percentage"> '   + FAPUPercentDaily +'%'+ '</td>');
  CHOCDFDisplay =  $("<tr>").html('<th scope="col"  class="maininfo">' + CHOCDFLabel + ' ' + CHOCDFQuantity + CHOCDFUnit +'</th> <td class="percentage"> ' + CHOCDFPercentDaily +'%'+ '</td>');
  SUGARDisplay =  $("<tr>").html(' <th scope="col" class="subinfo">' + SUGARLabel + ' ' + SUGARQuantity + SUGARUnit +'</th> <td class="percentage"> '   + SUGARPercentDaily +'%'+ '</td>');
  FIBTGDisplay =  $("<tr>").html(' <th scope="col" class="subinfo">' + FIBTGLabel + ' ' + FIBTGQuantity + FIBTGUnit +'</th> <td class="percentage"> '   + FIBTGPercentDaily +'%'+ '</td>');
  CHOLEDisplay =  $("<tr>").html('<th scope="col" class="maininfo">  ' + CHOLELabel + ' ' + CHOLEQuantity + CHOLEUnit +'</th> <td class="percentage"> '  + CHOLEPercentDaily +'%'+ '</td>');
  PROCNTDisplay =  $("<tr>").html('<th scope="col" class="maininfo">' + PROCNTLabel + ' ' + PROCNTQuantity + PROCNTUnit +'</th> <td class="percentage"> '  + PROCNTPercentDaily +'%'+ '</td>');
  NADisplay =  $("<tr>").html('<th scope="col" class="maininfo">  ' + NALabel + ' ' + NAQuantity + NAUnit +'</th> <td class="percentage"> '  + NAPercentDaily +'%'+ '</td>');
  CADisplay =  $("<tr>").html('<th scope="col" class="subinfo">' + CALabel + ' ' + CAQuantity + CAUnit +'</th> <td class="percentage"> '  + CAPercentDaily +'%'+ '</td>');
  FEDisplay =  $("<tr>").html('<th scope="col" class="subinfo">' + FELabel + ' ' + FEQuantity + FEUnit +'</th> <td class="percentage"> ' + FEPercentDaily +'%'+ '</td>');  
  VITCDisplay =  $("<tr>").html('<th scope="col" class="subinfo">' + VITCLabel + ' ' + VITCQuantity + VITCUnit +'</th> <td class="percentage"> '+ VITCPercentDaily +'%'+ '</td>');
  VITA_RAEDisplay =  $("<tr>").html('<th scope="col" class="subinfo">' + VITA_RAELabel + ' ' + VITA_RAEQuantity + VITA_RAEUnit +'</th> <td class="percentage"> ' + VITA_RAEPercentDaily +'%'+ '</td>');

  tableBody.append(fatDisplay, FASATDisplay, FATRNDisplay,FAMSDisplay,
    FAPUDisplay, CHOCDFDisplay, SUGARDisplay,FIBTGDisplay, CHOLEDisplay, PROCNTDisplay
    ,NADisplay, CADisplay, FEDisplay, VITCDisplay, VITA_RAEDisplay )


    nutritionalTable.append(tableHead,tableBody);

  $(tableDiv).append(nutritionalTable);
  $("#nutrition-modal-body").append(tableDiv); 

}