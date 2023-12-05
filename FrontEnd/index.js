let worksData = [];
let categoriesData = [];

// récupérer les données des travaux via l'API
const fetchWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      worksData = data;
      worksDisplay(worksData);
    });
};
fetchWorks();

// afficher les travaux dans la galerie des travaux
const worksDisplay = (worksData) => {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = worksData
    .map(
      (work) =>
        `<figure>
           <img src="${work.imageUrl}" alt="photo de ${work.title}">
           <figcaption>${work.title}</figcaption>
         </figure>`
    )
    .join("");
};

// récupérer les données des catégories via l'API
const fetchCategories = async () => {
  await fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      buttons(data);
      categoriesData = data;
    });
};
fetchCategories();

//créer des boutons de filtre en fonction des catégories
const buttons = (categoriesData) => {
  const containerFilter = document.getElementById("container-filter");

  // bouton pour afficher tous les travaux
  const buttonAll = document.createElement("button");
  buttonAll.className = "btn activated";
  buttonAll.dataset.id = "0";
  buttonAll.textContent = "Tous";
  buttonAll.addEventListener("click", () => {
    if (buttonAll !== activeButton) {
      activeButton.classList.remove("activated");
      buttonAll.classList.add("activated");
      activeButton = buttonAll;
      filterWorks("Tous");
    }
  });
  containerFilter.appendChild(buttonAll);

  // créer un bouton pour chaque catégorie
  let activeButton = buttonAll;

  categoriesData.forEach((category) => {
    const bouton = document.createElement("button");
    bouton.classList.add("btn");
    bouton.textContent = category.name;
    bouton.addEventListener("click", () => {
      if (bouton !== activeButton) {
        activeButton.classList.remove("activated");
        bouton.classList.add("activated");
        activeButton = bouton;
      }
      filterWorks(category.name);
    });
    containerFilter.appendChild(bouton);
  });
};

// filtrer les travaux en fonction de la catégorie sélectionnée
const filterWorks = (categoryName) => {
  const worksFiltre =
    categoryName === "Tous"
      ? worksData
      : worksData.filter(
          (work) => work.category && categoryName === work.category.name
        );
  console.log(worksFiltre);
  worksDisplay(worksFiltre);
};
