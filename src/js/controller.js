import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// https://forkify-api.herokuapp.com/api/v2/recipes/664c8f193e7aa067e94e845a

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // Get id from url
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // 1) Update bookmarks view to mark active
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);
    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (page) {
  // Update results
  resultsView.render(model.getSearchResultsPage(page));
  // Update pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update servings and ingredients in state
  model.updateServings(newServings);
  // Update servings and ing in recipe view
  // - Re-render whole recipe
  // recipeView.render(model.state.recipe);
  // - Update recipe
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (data) {
  try {
    // Display spinner
    addRecipeView.renderSpinner();
    // console.log(data);
    await model.uploadRecipe(data);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Update URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Render bookmarks
    // - DONOT WORK AS HASH IS STILL THE SAME
    bookmarksView.render(model.state.bookmarks);

    // Display success message
    addRecipeView.renderMessage();

    // Close modal window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
    // console.log(model.state.recipe);
  } catch (err) {
    console.error('⛔⛔', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerAddRecipe(controlAddRecipe);
};
init();
