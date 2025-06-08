export function createCard(cardData, deleteFunction, likeFunction) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  if (likeFunction) {
    likeButton.addEventListener("click", likeFunction);
  }

  deleteButton.addEventListener("click", () => {
    deleteFunction(deleteButton);
  });

  return cardElement;
}

export function handleLikeButtonClick(event) {
  event.currentTarget.classList.toggle("card__like-button_is-active");
}

export function handleDeleteCard(button) {
  const listItem = button.closest(".places__item");
  listItem.remove();
}