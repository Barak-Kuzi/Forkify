import 'regenerator-runtime';
import { AJAXrequest } from "./helpers";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";


export const state = {
    recipe: {},
    search: {
        query: '',
        recipes: [],
        currentPage: 1,
        resultPerPage: RES_PER_PAGE
    },
    bookmarks: []
};

const createRecipeObject = function (resData){
    const {recipe} = resData.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key: recipe.key})
    }
}

export const loadRecipe = async function(recipeID){
    try{
        const resData = await AJAXrequest(`${API_URL}/${recipeID}?key=${KEY}`);

        state.recipe = createRecipeObject(resData);

        // Loading data from the bookmark array to a current recipe
        state.bookmarks.some(bookmark => bookmark.id === recipeID) ? state.recipe.bookmark = true :
            state.recipe.bookmark = false;
    }catch (error){
        // error handling - Throws the message to the controller and forwards it to the recipeView
        console.error(`🚨🚨 ${error} 🚨🚨`);
        throw error
    }
}

export const loadSearchResults = async function(query){
    try{
        const resDataSearch = await AJAXrequest(`${API_URL}?search=${query}&key=${KEY}`);

        const {recipes} = resDataSearch.data;
        state.search.recipes = recipes.map(obj => {
            return {id: obj.id,
                title: obj.title,
                publisher: obj.publisher,
                image: obj.image_url,
                ...(obj.key && {key: obj.key})
            }});
        state.search.currentPage = 1;
    }catch (error){
        console.error(`🚨🚨 ${error} 🚨🚨`);
        throw error;
    }
}

export const getSearchResultPage = function (page = state.search.currentPage){
    state.search.currentPage = page;
    const start = (page - 1) * state.search.resultPerPage;  // page 1 -> (1-1) * 10 = 0
    const end = page * state.search.resultPerPage;  // page 1 -> 1 * 10 = 10

    return state.search.recipes.slice(start, end);
}

export const updateIngredientsAndServings = function (newServings){
    // Update all the ingredients according to the number of servings
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });

    state.recipe.servings = newServings;
}

const persistBookmarks = function (){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function (recipe){
    // Add bookmark to array
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) recipe.bookmark = true;

    // Add to localStorage
    persistBookmarks();
}

export const removeBookmark = function (recipeID){
    // Delete bookmark from the array
    const index = state.bookmarks.findIndex(element => element.id === recipeID);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmarked
    if (recipeID === state.recipe.id) state.recipe.bookmark = false;

    // Add to localStorage
    persistBookmarks();
}

const initializeLocalStorage = function (){
    const storage = localStorage.getItem('bookmarks');
    if (!storage) return;
    state.bookmarks = JSON.parse(storage);
}
initializeLocalStorage();

const clearBookmarks = function (){
    localStorage.clear('bookmarks');
}
// removing all the data from the localStorage
// clearBookmarks();

export const uploadRecipe = async function (newRecipe){
    try{
        // Takes the ingredients from the object and converts them in the appropriate format for the API
        const ingredients = Object.entries(newRecipe).filter(entry =>
            entry[0].startsWith('ingredient') && entry[1] !== '').map(ing => {
            const ingArray = ing[1].split(',').map(element => element.trim());
            const [quantity, unit, description] = ingArray;
            if (ingArray.length !== 3)
                throw new Error('Wrong ingredient format! Please use the correct format.');
            return {quantity: quantity ? +quantity : null, unit, description};
        });

        // Creates a new object according to the existing fields in the API
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }

        // Uploads the object to the API and then from the returned information
        // creates a new object according to the appropriate fields for the application
        const data = await AJAXrequest(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    }catch (error){
        throw error;
    }



}