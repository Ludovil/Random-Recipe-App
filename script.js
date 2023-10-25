//////////////////
// NAVIGATION
//////////////////

const backHome = document.querySelector(".back_home");
const goCategory = document.querySelector(".go_category");

backHome.style.visibility = "hidden";

backHome.addEventListener("click", () => {
  console.log("back home");

  recipeSection.classList.add("hidden");
  categorySection.classList.add("hidden");
  listSection.classList.add("hidden");
  homeSection.classList.remove("hidden");
  backHome.style.visibility = "hidden";
});

goCategory.addEventListener("click", () => {
  homeSection.classList.add("hidden");
  recipeSection.classList.add("hidden");
  categorySection.classList.remove("hidden");
  backHome.style.visibility = "visible";
});

//////////////////
// HOME PAGE
//////////////////

const homeSection = document.querySelector("#home_page");
const recipeSection = document.querySelector("#recipe_page");
const contentRecipeSection = document.querySelector(".content_recipe_section");
const categorySection = document.querySelector("#category_page");
const listSection = document.querySelector("#list_page");

// /!\ TO DO /!\
//changer le query selector du btn et plus de besoin de for each
//

const recipeBtns = document.querySelectorAll(".recipe_btn");
const listBtn = document.querySelector(".list_btn");

recipeBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    try {
      console.log("click");
      homeSection.classList.add("hidden");
      categorySection.classList.add("hidden");
      recipeSection.classList.remove("hidden");
      backHome.style.visibility = "visible";

      // CLEAN PREVIOUS RECIPE
      // Dispatch the cleanEvent before fetching a new recipe
      const cleanEvent = new Event("cleanRecipe");
      document.dispatchEvent(cleanEvent);

      await getRecipe();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });
});

// Listen for the cleanRecipe event and clean the recipe section
document.addEventListener("cleanRecipe", () => {
  console.log("Cleaning recipe section");
  while (contentRecipeSection.firstChild) {
    contentRecipeSection.firstChild.remove();
  }
});

///////////////////
// RECIPE PAGE
///////////////////

const apiData = "https://www.themealdb.com/api/json/v1/1/random.php";

async function getRecipe() {
  const response = await fetch(apiData);
  const data = await response.json();
  const recipe = data.meals[0];
  console.log("Recipe loaded successfully");
  console.log(recipe);
  createRecipe(recipe);
}

function createRecipe(recipe) {
  // Title
  const recipeTitle = document.createElement("h2");
  recipeTitle.innerText = recipe.strMeal;
  contentRecipeSection.appendChild(recipeTitle);
  recipeSection.appendChild(contentRecipeSection);
  // Category
  const recipeCategory = document.createElement("p");
  recipeCategory.innerText = recipe.strCategory;
  recipeCategory.classList.add("recipe_category");
  contentRecipeSection.appendChild(recipeCategory);
  recipeSection.appendChild(contentRecipeSection);

  // Area
  const recipeArea = document.createElement("p");
  recipeArea.innerText = recipe.strArea;
  recipeArea.classList.add("recipe_area");
  contentRecipeSection.appendChild(recipeArea);
  recipeSection.appendChild(contentRecipeSection);

  // Image
  const recipeImg = document.createElement("img");
  recipeImg.src = recipe.strMealThumb;
  contentRecipeSection.appendChild(recipeImg);
  recipeSection.appendChild(contentRecipeSection);

  // Tags
  const stringTags = recipe.strTags;
  const arrayTags = stringTags ? stringTags.split(",") : []; // // Check if stringTags is null or undefined

  arrayTags.forEach((element) => {
    const recipeTag = document.createElement("p");
    recipeTag.innerText = `#${element}`;
    recipeTag.classList.add("recipe_tag");
    contentRecipeSection.appendChild(recipeTag);
    recipeSection.appendChild(contentRecipeSection);
  });
  // Ingredients & Measures
  const recipeIngredientsAndMeasures = document.createElement("ul");
  contentRecipeSection.appendChild(recipeIngredientsAndMeasures);
  recipeSection.appendChild(contentRecipeSection);
  for (let i = 1; i <= 20; i++) {
    if (recipe["strIngredient" + i] && recipe["strMeasure" + i]) {
      const liIngredient = document.createElement("li");
      liIngredient.classList.add("ingredients_measures");
      liIngredient.innerText =
        recipe["strIngredient" + i] + " - " + recipe["strMeasure" + i];
      recipeIngredientsAndMeasures.appendChild(liIngredient);
    }
  }

  // Instructions
  const recipeInstructions = document.createElement("p");
  recipeInstructions.innerText = recipe.strInstructions;
  recipeInstructions.classList.add("recipe_instructions");
  contentRecipeSection.appendChild(recipeInstructions);
  recipeSection.appendChild(contentRecipeSection);

  // Video
  const recipeVideoContainer = document.createElement("div");
  contentRecipeSection.appendChild(recipeVideoContainer);

  const videoId = extractVideoIdFromUrl(recipe.strYoutube);
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  const recipeVideo = document.createElement("iframe");
  recipeVideoContainer.appendChild(recipeVideo);
  recipeVideo.setAttribute("width", "560");
  recipeVideo.setAttribute("height", "315");
  recipeVideo.setAttribute("src", embedUrl);
  recipeVideo.setAttribute("frameborder", "0");
  recipeVideo.setAttribute("allowfullscreen", "true");

  function extractVideoIdFromUrl(url) {
    const videoIdRegex =
      /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com|\.be)\/(?:watch\?v=|embed\/|v\/)?([\w-]{11})(?:\S+)?/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : null;
  }
}

////////////////////////
// RECIPE CATEGORY PAGE
////////////////////////

const categoryGridContainer = document.querySelector(
  ".category_grid_container"
);

async function getRecipeCategory() {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    if (data.categories && Array.isArray(data.categories)) {
      const fragment = document.createDocumentFragment();

      data.categories.forEach((element) => {
        const categoryCard = document.createElement("div");
        categoryCard.classList.add("category_card");

        const categoryCardTop = document.createElement("div");
        categoryCardTop.classList.add("category_card_top");

        const categoryImg = document.createElement("img");
        categoryImg.classList.add("category_img");
        categoryImg.src = `img/${element.strCategory}.jpg`;

        const categoryP = document.createElement("p");
        categoryP.classList.add("category_p");
        categoryP.innerText = element.strCategory;

        // Buttons Random/List
        const categoryBtn = document.createElement("div");
        categoryBtn.classList.add("category_buttons");

        const randomBtn = document.createElement("button");
        randomBtn.classList.add("button", "random_button");
        randomBtn.innerText = "Random";

        const listBtn = document.createElement("button");
        listBtn.classList.add("button", "list_button");
        listBtn.innerText = "List";

        // Random Btn event
        randomBtn.addEventListener("click", async () => {
          try {
            const randomData = await getListCategory(element.strCategory);

            // Get a random recipe in the defined category
            const randomRecipe =
              randomData.meals[
                Math.floor(Math.random() * randomData.meals.length)
              ];

            // CLEAN PREVIOUS RECIPE
            // Dispatch the cleanEvent before fetching a new recipe
            const cleanEvent = new Event("cleanRecipe");
            document.dispatchEvent(cleanEvent);

            // extract the ID of the recipe
            const recipeId = randomRecipe.idMeal;
            // get the whole recipe with ID
            const recipeData = await getRecipeWithId(recipeId);
            const recipe = recipeData.meals[0];
            console.log("random btn clicked");
            console.log(recipe);
            // make disappear the category section
            categorySection.classList.add("hidden");
            // getting the new recipe :
            // Problem  => don't get the expected recipe but a random one - has to work on the getRecipe() function
            recipeSection.classList.remove("hidden");
            // getRecipe();
            createRecipe(recipe);
          } catch (err) {
            console.error("An error occured: ", err);
          }
        });

        // List Btn event
        listBtn.addEventListener("click", async () => {
          const recipeList = await getListCategory(element.strCategory);
          // make disappear the category section
          categorySection.classList.add("hidden");
          listSection.classList.remove("hidden");
          console.log(recipeList);
          console.log(listSection);
        });

        // Append the elements to the fragment
        categoryCardTop.appendChild(categoryP);
        categoryCardTop.appendChild(categoryImg);
        categoryCard.appendChild(categoryCardTop);
        categoryCard.appendChild(categoryBtn);
        categoryBtn.appendChild(randomBtn);
        categoryBtn.appendChild(listBtn);
        fragment.appendChild(categoryCard);
      });

      // Append the fragment to the container once
      categoryGridContainer.appendChild(fragment);
    } else {
      console.error("Data is not in the expected format");
    }
  } catch (err) {
    console.error("An error occured:", err);
  }
}

async function getListCategory(category) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("An error occured:", err);
  }
}

async function getRecipeWithId(id) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("An error occured:", err);
  }
}

getRecipeCategory();

////////////////////////
// RECIPE LIST PAGE
////////////////////////
