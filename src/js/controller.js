// Polyfills are used to make modern JavaScript features to support older versions of browsers
import 'core-js';
import 'regenerator-runtime';
// Import of objects and functions from the project
import * as model from './model.js';
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";
import bookmarkView from "./views/bookmarkView";
import addRecipeView from "./views/addRecipeView";
import { MODAL_CLOSE_SEC } from "./config";


///////////////////////////////////////
// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
// a4136108-8da3-48fe-b308-843dd190a620
///////////////////////////////////////

const controlRecipe = async function (){
  try{
    // To get hash from the URL
    const recipeID = window.location.hash.slice(1);
    if (!recipeID) return;

    // Show loading spinner
     recipeView.renderSpinner();

     // Update results view to mark a selected search result
    resultsView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmarks);

    // Loading recipe
    await model.loadRecipe(recipeID);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  }catch (err){
    recipeView.renderError();
    console.error(err)
  }
}

const controlSearchResult = async function (){
  try{
    // Show loading spinner
    resultsView.renderSpinner();

    // Get a query from the user
    const query = searchView.getQuery();
    if (!query) return;

    // Loading information about the query from the database
    await model.loadSearchResults(query);

    // Rendering results (the default is to page 1)
    resultsView.render(model.getSearchResultPage());

    // Rendering pagination buttons
    paginationView.render(model.state.search);
  }catch (error){
    console.error(error);
  }
}

const controlPaginationResult = function (goToPage){
  // Rendering results to a specific page
  resultsView.render(model.getSearchResultPage(goToPage));

  // Rendering new pagination buttons
  paginationView.render(model.state.search);
}

const controlUpdateServings = function (newServing){
  // Update the recipe servings
  model.updateIngredientsAndServings(newServing);

  // Update the recipe view without rendering everything again from the beginning
  recipeView.update(model.state.recipe);
}

const controlUpdateBookmark = function (){
  // Add / remove bookmark
  !model.state.recipe.bookmark ? model.addBookmark(model.state.recipe) : model.removeBookmark(model.state.recipe.id);

  // Update the recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarkView.render(model.state.bookmarks)
}

const controlBookmark = function (){
  bookmarkView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe){
  try{
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function (){
      addRecipeView.toggleWindow()
    }, (MODAL_CLOSE_SEC * 1000));
  }catch (err){
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}

const init = function (){
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlUpdateServings);
  recipeView.addHandlerUpdateBookmark(controlUpdateBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClickBtn(controlPaginationResult);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();