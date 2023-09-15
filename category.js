const categoryGridContainer = document.querySelector(
  ".category_grid_container"
);

async function getRecipeCategory() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const data = await response.json();
  console.log(data);
  const numItems = data.categories.length;
  const numRows = Math.ceil(numItems / 4); // Assuming 4 columns per row
  categoryGridContainer.style.gridTemplateRows = `repeat(${numRows}, minmax(400px, 1fr))`;

  // Create a document fragment to batch append elements
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

    const categoryBtn = document.createElement("div");
    categoryBtn.classList.add("category_buttons");

    const randomBtn = document.createElement("button");
    randomBtn.classList.add("button", "random_button");
    randomBtn.innerText = "Random";

    const listBtn = document.createElement("button");
    listBtn.classList.add("button", "list_button");
    listBtn.innerText = "List";

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
}

getRecipeCategory();
