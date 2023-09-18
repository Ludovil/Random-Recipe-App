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

        // Buttons
        const categoryBtn = document.createElement("div");
        categoryBtn.classList.add("category_buttons");

        const randomBtn = document.createElement("button");
        randomBtn.classList.add("button", "random_button");
        randomBtn.innerText = "Random";

        const listBtn = document.createElement("button");
        listBtn.classList.add("button", "list_button");
        listBtn.innerText = "List";

        randomBtn.addEventListener("click", async () => {
          try {
            const randomData = await getListCategory(element.strCategory);

            // Get a random recipe in the defined category
            const randomRecipe =
              randomData.meals[
                Math.floor(Math.random() * randomData.meals.length)
              ];

            // extract the ID of the recipe
            const recipeId = randomRecipe.idMeal;
            // get the whole recipe with ID
            const recipeData = await getRecipeWithId(recipeId);
            const recipe = recipeData.meals[0];
            console.log(recipe);
          } catch (err) {
            console.error("An error occured: ", err);
          }
        });

        listBtn.addEventListener("click", async () => {
          const recipeList = await getListCategory(element.strCategory);
          console.log(recipeList.meals[0]);
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
