import "./pages/index.css";
import { createCard } from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getUserInfo,
  getInitialCards,
  updateProfile,
  addCard,
  updateAvatar,
  deleteCard,
  likeCard,
  unlikeCard,
} from "./components/api.js";

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);

const profilePopup = document.querySelector(".popup_type_edit");
const profileForm = profilePopup.querySelector(".popup__form");
const nameInput = profileForm.querySelector('input[name="name"]');
const descriptionInput = profileForm.querySelector('input[name="description"]');
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const newCardPopup = document.querySelector(".popup_type_new-card");
const newCardForm = newCardPopup.querySelector(".popup__form");
const placeNameInput = newCardForm.querySelector('input[name="place-name"]');
const linkInput = newCardForm.querySelector('input[name="link"]');

const placesList = document.querySelector(".places__list");
const profileEditButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");

const imagePopup = document.querySelector(".popup_type_image");
const popupImg = imagePopup.querySelector(".popup__image");
const caption = imagePopup.querySelector(".popup__caption");

const avatarButton = document.querySelector(".profile__image");
const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarForm = avatarPopup.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector('input[name="avatar"]');

let currentUserId = null;

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    currentUserId = userData._id;
    avatarButton.style.backgroundImage = `url(${userData.avatar})`;

    cards.reverse().forEach((cardData) => {
      const cardItem = createCard(cardData, currentUserId, {
        handleImageClick,
        handleDeleteClick,
        handleLikeClick,
      });
      placesList.prepend(cardItem);
    });
  })
  .catch((err) => {
    console.error("Ошибка загрузки данных:", err);
  });

function renderSaving(
  button,
  isSaving,
  savingText = "Сохранение...",
  defaultText = "Сохранить"
) {
  button.textContent = isSaving ? savingText : defaultText;
}

function handleImageClick(cardData) {
  popupImg.src = cardData.link;
  popupImg.alt = cardData.name;
  caption.textContent = cardData.name;
  openPopup(imagePopup);
}

function handleDeleteClick(cardData, cardElement) {
  deleteCard(cardData._id)
    .then(() => cardElement.remove())
    .catch((err) => console.error("Ошибка удаления карточки:", err));
}

function handleLikeClick(cardData, likeButton, likeCount) {
  const liked = likeButton.classList.contains("card__like-button_is-active");
  const action = liked ? unlikeCard : likeCard;

  action(cardData._id)
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-button_is-active");
      likeCount.textContent = updatedCard.likes.length;
    })
    .catch((err) => console.error("Ошибка при лайке:", err));
}

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openPopup(profilePopup);
});

addButton.addEventListener("click", () => {
  newCardForm.reset();
  clearValidation(newCardForm, validationConfig);
  openPopup(newCardPopup);
});

avatarButton.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openPopup(avatarPopup);
});

document.querySelectorAll(".popup__close").forEach((btn) => {
  btn.addEventListener("click", () => {
    const popup = btn.closest(".popup");
    closePopup(popup);
    if (popup === profilePopup) {
      clearValidation(profileForm, validationConfig);
    } else if (popup === newCardPopup) {
      clearValidation(newCardForm, validationConfig);
    } else if (popup === avatarPopup) {
      clearValidation(avatarForm, validationConfig);
    }
  });
});

profileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = profileForm.querySelector(".popup__button");
  renderSaving(submitButton, true);

  updateProfile(nameInput.value, descriptionInput.value)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closePopup(profilePopup);
    })
    .catch((err) => console.error("Ошибка обновления профиля:", err))
    .finally(() => {
      renderSaving(submitButton, false);
    });
});

newCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = newCardForm.querySelector(".popup__button");
  renderSaving(submitButton, true);

  addCard(placeNameInput.value, linkInput.value)
    .then((cardData) => {
      const newCardItem = createCard(cardData, currentUserId, {
        handleImageClick,
        handleDeleteClick,
        handleLikeClick,
      });
      placesList.prepend(newCardItem);
      closePopup(newCardPopup);
      newCardForm.reset();
      clearValidation(newCardForm, validationConfig);
    })
    .catch((err) => console.error("Ошибка добавления карточки:", err))
    .finally(() => {
      renderSaving(submitButton, false);
    });
});

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = avatarForm.querySelector(".popup__button");
  renderSaving(submitButton, true);

  updateAvatar(avatarInput.value)
    .then((userData) => {
      avatarButton.style.backgroundImage = `url(${userData.avatar})`;
      closePopup(avatarPopup);
    })
    .catch((err) => console.error("Ошибка обновления аватара:", err))
    .finally(() => {
      renderSaving(submitButton, false);
    });
});
