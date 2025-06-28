export function createCard(
  cardData,
  currentUserId,
  { handleImageClick, handleDeleteClick, handleLikeClick }
) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  const likeCount = cardElement.querySelector(".card__like-count");
  if (!likeCount) {
    likeCount = document.createElement("span");
    likeCount.classList.add("card__like-count");
    likeButton.after(likeCount);
  }

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  cardImage.addEventListener("click", () => {
    handleImageClick(cardData);
  });

  if (cardData.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => {
      handleDeleteClick(cardData, cardElement);
    });
  }

  if (cardData.likes.some((user) => user._id === currentUserId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  likeButton.addEventListener("click", () => {
    handleLikeClick(cardData, likeButton, likeCount);
  });

  return cardElement;
}
