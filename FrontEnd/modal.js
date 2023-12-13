let modal = null;
let modal2 = null;

const token = localStorage.getItem("token");
const titleInput = document.getElementById("input-title");
const categorySelect = document.getElementById("category");
const imageInput = document.getElementById("add__picture__modal");
const buttonValid = document.getElementById("add__modal");

const button = document.getElementById("add__picture__upload");
const input = document.querySelector(".add__picture__btn");

// ouvrir le modal1
const openModal = function (e) {
    e.preventDefault();
    //target sur une ancre
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("arial-modal", "true");
  
    // afficher la gallerie dans l'api
    const figure = document.querySelector(".gallery__modal");
    figure.innerHTML = worksData
      .map(
        (project) => `
          <figure>
            <i class="fa-regular fa-trash-can" id="delete__picture"></i>
             <img src="${project.imageUrl}" alt="photo de ${project.title}" data-id="${project.id}" >
          </figure>`
      )
      .join("");
    
    // supprimer l'image du modal
    const deletePictures = document.querySelectorAll("#delete__picture");

  // rechercher l'id de data de chaque image au click
  deletePictures.forEach((deletePicture) => {
    deletePicture.addEventListener("click", function () {
      // supprimer l'element parent du bouton
      const imageParent = deletePicture.parentElement;
      // obtenir l'id de l'image
      const pictureData = imageParent
        .querySelector("img")
        .getAttribute("data-id");
      // supprimer l'element parent de figure
      imageParent.remove();
      console.log("Image " + pictureData + " supprimée");
      // supprimer l'image ainsi que l'api au click
      deletePictureApi(pictureData);
      // supprimer l'image de la galerie existante
      worksData = worksData.filter((work) => work.id !== parseInt(pictureData));

      // actualiser la galerie
      worksDisplay(worksData);
    });
  });

  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".close__icon").addEventListener("click", closeModal);
  modal
    .querySelector(".js__modal__stop")
    .addEventListener("click", stopPropagation);
};

//supprimer une image de l'api 
const deletePictureApi = async (pictureData) => {
  try {
    // Envoi une requête Delete pour supprimer l'image
    const response = await fetch(
      `http://localhost:5678/api/works/${pictureData}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.ok) {
      console.log("Image " + pictureData + " supprimée de l'Api");
      alert("La photo est supprimée");
    } else {
      console.error("Erreur lors de la suppression de l'image de l'API");
    }
  } catch (error) {
    console.error("Erreur lors de la requête DELETE :" + error);
  }
};

  // ajouter un nouveau modal
  const addNewModal = function () {
    const target2 = document.querySelector("#submit__add__picture");
    target2.addEventListener("click", (e) => {
      e.preventDefault();
      const openModal2 = document.getElementById("modal2");
      openModal2.style.display = null;
      modal.style.display = "none";
      modal2 = openModal2;
      modal2.addEventListener("click", closeModal2);
      modal2.querySelector(".close__icon").addEventListener("click", closeModal2);
      modal2
        .querySelector(".js__modal__stop")
        .addEventListener("click", stopPropagation);
    });
  };
  addNewModal();
  
  // retourner au modal précédent
  const returnModal = function () {
    const returnModal1 = document.querySelector(".return__icon");
    returnModal1.addEventListener("click", (e) => {
      e.preventDefault();
      modal2.style.display = "none";
      modal.style.display = null;
      resetModal2();
    });
  };
  returnModal();
  
  // afficher / charger l'image
  // simuler un click sur le champ input file
  button.addEventListener("click", () => {
    input.click();
  });
  
  input.addEventListener("change", function (e) {
    // récuperer le fichier selectionné du champ
    let file = e.target.files[0];
    // traitement et affichage du fichier
    showFile(file);
  });
  
  // Fonction pour afficher le fichier uploadé
  function showFile(file) {
    let image = document.getElementById("image");
    document.getElementById("erase").style.display = "none";
    image.style.display = "block";
    // on recupère le type du fichier
    let fileType = file.type;
    let fileExtension = ["image/jpeg", "image/jpg", "image/png"];
    //  on verifie la validité du type du fichier
    if (fileExtension.includes(fileType)) {
      // on verifie la taille du fichier
      if (file.size <= 4 * 1024 * 1024) {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
  
        fileReader.onload = () => {
          let fileUrl = fileReader.result;
          image.src = fileUrl;
        };
      } else {
        alert("L'image dépasse la taille maximale de 4 mo.");
      }
    } else {
      alert("Ceci n'est pas une image");
    }
  }
  
  // fonction pour changer la couleur du bouton Valider
  const changeBtnColor = function () {
    if (
      titleInput.value !== "" &&
      categorySelect.value !== "0" &&
      imageInput.files[0] !== undefined
    ) {
      buttonValid.style.background = "#1D6154";
    } else {
      buttonValid.style.background = "#A7A7A7";
    }
  };
  
  titleInput.addEventListener("change", changeBtnColor);
  categorySelect.addEventListener("change", changeBtnColor);
  imageInput.addEventListener("change", changeBtnColor);
  
  // fonction pour envoyer le formulaire
  buttonValid.addEventListener("click", async (e) => {
    // récuperer les champs
    const imageFile = imageInput.files[0];
    const title = titleInput.value;
    const category = categorySelect.value;
  
    if (imageFile && title && category) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("title", title);
      formData.append("category", category);
  
      try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        console.log(formData);
  
        if (response.ok) {
          let newWorks = await response.json();
          newWorks.category = parseInt(newWorks.category);
          console.log(newWorks);
          worksData.push(newWorks);
          worksDisplay(worksData);
          modal2.style.display = "none";
          modal2 = null;
          console.log("image envoyée avec succès");
          resetModal2();
        } else {
          console.error("erreur lors de l'envoi");
        }
      } catch (error) {
        console.error("Erreur lors de la requête à l'API : " + error);
      }
    } else {
      alert("Veuillez remplir tous les champs du formulaire.");
    }
  });

  // fonction pour fermer le modal
  const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".close__icon").removeEventListener("click", closeModal);
    modal
      .querySelector(".js__modal__stop")
      .removeEventListener("click", stopPropagation);
    modal = null;
  };
  
  const closeModal2 = function (e) {
    if (modal2 === null) return;
    e.preventDefault();
    modal2.style.display = "none";
    modal2 = null;
    resetModal2();
  };
  
  // réinitialiser le modal2
  const resetModal2 = async function () {
    titleInput.value = "";
    categorySelect.value = "0";
    imageInput.value = "";
    document.getElementById("erase").style.display = "block";
    let image = document.getElementById("image");
    image.style.display = "none";
  };
  
  // empecher la propagation des événements
  const stopPropagation = function (e) {
    e.stopPropagation();
  };
  
  document.querySelectorAll(".js__modal").forEach((a) => {
    a.addEventListener("click", openModal);
  });
  
  // fermer le modal avec la touche ech
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeModal(e);
      closeModal2(e);
    }
  });
  

  

