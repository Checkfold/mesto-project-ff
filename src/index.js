import "./pages/index.css";
import { initialCards } from "./components/cards.js";

import { createCard, handleLikeButtonClick, handleDeleteCard } from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";

const placesList = document.querySelector(".places__list");
const profileEditButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");

const profilePopup = document.querySelector(".popup_type_edit");
const profileForm = profilePopup.querySelector(".popup__form");
const nameInput = profileForm.querySelector('input[name="name"]');
const descriptionInput = profileForm.querySelector('input[name="description"]');

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const newCardPopup = document.querySelector('.popup_type_new-card');
const newCardForm = newCardPopup.querySelector('.popup__form');
const placeNameInput = newCardForm.querySelector('input[name="place-name"]');
const linkInput = newCardForm.querySelector('input[name="link"]');

const imagePopup = document.querySelector('.popup_type_image');
const popupImg = imagePopup.querySelector('.popup__image');
const caption = imagePopup.querySelector('.popup__caption');

initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, handleDeleteCard, handleLikeButtonClick);

  placesList.appendChild(cardElement);
});

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  
  openPopup(profilePopup);
});

addButton.addEventListener("click", () => {
  newCardForm.reset();
  
  openPopup(newCardPopup);
});

document.querySelectorAll('.popup__close').forEach((btn) => {
  btn.addEventListener("click", () => {
    const popup = btn.closest('.popup');
    closePopup(popup);
});
});

placesList.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("card__image")) {
    const imgSrc = evt.target.src;
    const imgAlt = evt.target.alt;

    popupImg.src = imgSrc;
    popupImg.alt = imgAlt;
    caption.textContent = imgAlt;

    openPopup(imagePopup);
  }
});

profileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;

  closePopup(profilePopup);
});

newCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

   const name= placeNameInput.value;
   const link= linkInput.value;

   const newCard= createCard({ name, link }, handleDeleteCard, handleLikeButtonClick);

   placesList.prepend(newCard);

   closePopup(newCardPopup);

   newCardForm.reset();
});