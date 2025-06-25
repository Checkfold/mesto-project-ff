import { deleteCard as apiDeleteCard, likeCard, unlikeCard } from './api.js';

export function createCard(cardData, currentUserId) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  let likeCount = cardElement.querySelector(".card__like-count");
  if (!likeCount) {
    likeCount = document.createElement("span");
    likeCount.classList.add("card__like-count");
    likeButton.after(likeCount);
  }

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  if (cardData.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => {
      apiDeleteCard(cardData._id)
        .then(() => cardElement.remove())
        .catch(err => console.error("Ошибка удаления:", err));
    });
  }

  if (cardData.likes.some(user => user._id === currentUserId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  likeButton.addEventListener("click", () => {
    const liked = likeButton.classList.contains("card__like-button_is-active");
    const action = liked ? unlikeCard : likeCard;

    action(cardData._id)
      .then(updatedCard => {
        likeButton.classList.toggle("card__like-button_is-active");
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch(err => console.error("Ошибка лайка:", err));
  });

  return cardElement;
}
