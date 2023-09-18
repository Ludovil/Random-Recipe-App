const getRecipeBtn = document.querySelector(".get_Recipe_Btn");
const recipeSection = document.querySelector("#recipe_section");
const topSection = document.querySelector(".top-section");

const homePageSection = document.querySelector(".home_section");
const CategoryPageSection = document.querySelector(".category_section");

const navDiv = document.querySelector(".div_navigation");
navDiv.addEventListener("click", () => {
  console.log("navDiv");
  homePageSection.classList.add("hidden");
  CategoryPageSection.classList.remove("hidden");
});

getRecipeBtn.addEventListener("click", () => {
  console.log("get recipe");
  cleanRecipeSection();
  getRecipe();
});

const apiData = "https://www.themealdb.com/api/json/v1/1/random.php";

async function getRecipe() {
  const response = await fetch(apiData);
  const data = await response.json();
  const recipe = data.meals[0];
  console.log(recipe);

  // Title
  const recipeTitle = document.createElement("h2");
  recipeTitle.innerText = recipe.strMeal;
  recipeSection.appendChild(recipeTitle);
  topSection.innerHTML = "";

  // Image
  const recipeImg = document.createElement("img");
  recipeImg.src = recipe.strMealThumb;
  topSection.appendChild(recipeImg);
  recipeSection.appendChild(topSection);

  // Category header
  const categoryHeader = document.createElement("h3");
  categoryHeader.innerText = "Category";
  categoryHeader.classList.add("category-header");
  // Category
  const recipeCategory = document.createElement("p");
  recipeCategory.innerText = recipe.strCategory;
  recipeCategory.classList.add("category");
  // Category Icon
  const categoryIcon = document.createElement("img");
  categoryIcon.classList.add("category-icon");
  const categoryIconFileName = `${recipe.strCategory}.png`;
  categoryIcon.src = `category_icons/${categoryIconFileName}`;
  console.log(categoryIconFileName);
  topSection.appendChild(categoryHeader);
  topSection.appendChild(categoryIcon);
  topSection.appendChild(recipeCategory);

  // Area Header
  const areaHeader = document.createElement("h3");
  areaHeader.innerText = "Area";
  areaHeader.classList.add("area-header");
  // Area
  const recipeArea = document.createElement("p");
  recipeArea.innerText = recipe.strArea;

  topSection.appendChild(areaHeader);
  topSection.appendChild(recipeArea);

  // Tags
  const stringTags = recipe.strTags;
  const arrayTags = stringTags.split(",");

  arrayTags.forEach((element) => {
    const recipeTag = document.createElement("p");
    recipeTag.innerText = `#${element}`;
    topSection.appendChild(recipeTag);
  });

  // Ingredients & Measures
  const recipeIngredientsAndMeasures = document.createElement("ul");
  topSection.appendChild(recipeIngredientsAndMeasures);
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
  recipeInstructions.classList.add("recipe_instructions");
  topSection.appendChild(recipeInstructions);
  recipeInstructions.innerText = recipe.strInstructions;

  // Video
  const recipeVideoContainer = document.createElement("div");
  topSection.appendChild(recipeVideoContainer);

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
// update
function cleanRecipeSection() {
  while (recipeSection.firstChild) {
    recipeSection.firstChild.remove();
  }
}
