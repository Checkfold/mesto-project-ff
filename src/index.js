import "./pages/index.css";
import { initialCards } from "./components/cards.js";

const cardTemplate = document.querySelector("#card-template").content;

const placesList = document.querySelector(".places__list");

function createCard(cardData, deleteFunction, likeFunction) {
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

function deleteCard(button) {
  const listItem = button.closest(".places__item");
  listItem.remove();
}

initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, deleteCard, handleLikeButtonClick);
  placesList.appendChild(cardElement);
});

// пр 6 ниже

//3. Работа модальных окон

import { openPopup, closePopup } from "./components/modal.js";

const profileEditButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");

profileEditButton.addEventListener("click", () => {
  const popupEdit = document.querySelector(".popup_type_edit");
  openPopup(popupEdit);
});

addButton.addEventListener("click", () => {
  const popupNewCard = document.querySelector(".popup_type_new-card");
  openPopup(popupNewCard);
});

placesList.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("card__image")) {
    const imgSrc = evt.target.src;
    const imgAlt = evt.target.alt;
    const popupImage = document.querySelector(".popup_type_image");
    const popupImg = popupImage.querySelector(".popup__image");
    const caption = popupImage.querySelector(".popup__caption");

    popupImg.src = imgSrc;
    popupImg.alt = imgAlt;
    caption.textContent = imgAlt;

    openPopup(popupImage);
  }
});

document.querySelectorAll(".popup__close").forEach((btn) => {
  btn.addEventListener("click", () => {
    const popup = btn.closest(".popup");
    closePopup(popup);
  });
});

// 4. Редактирование имени и информации о себе

const profilePopup = document.querySelector(".popup_type_edit");
const profileForm = profilePopup.querySelector(".popup__form");
const nameInput = profileForm.querySelector('input[name="name"]');
const descriptionInput = profileForm.querySelector('input[name="description"]');

// Элементы страницы для обновления данных
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Обработчик открытия попапа с заполнением текущими данными
profileEditButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  openPopup(profilePopup);
});

// Обработчик отправки формы (сохранение изменений)
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  // Получение новых значений из полей формы
  const newName = nameInput.value;
  const newDescription = descriptionInput.value;

  // Обновление элементов на странице
  profileTitle.textContent = newName;
  profileDescription.textContent = newDescription;

  // Закрытие попапа после сохранения
  closePopup(profilePopup);
}

profileForm.addEventListener("submit", handleProfileFormSubmit);

// 6. Добавление карточки

const newCardForm = document.querySelector(".popup_type_new-card .popup__form");
const placeNameInput = newCardForm.querySelector('input[name="place-name"]');
const linkInput = newCardForm.querySelector('input[name="link"]');

// Обработчик отправки формы для добавления новой карточки
newCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const name = placeNameInput.value;
  const link = linkInput.value;

  // Создаем новую карточку
  const newCard = createCard({ name, link }, deleteCard, handleLikeButtonClick);

  // Добавляем ее в начало списка
  placesList.prepend(newCard);

  // Закрываем попап
  const popupNewCard = document.querySelector(".popup_type_new-card");
  closePopup(popupNewCard);

  // Очищаем форму
  newCardForm.reset();
});

// 7. Лайк карточки

function handleLikeButtonClick(event) {
  const likeButton = event.currentTarget;
  likeButton.classList.toggle("card__like-button_is-active");
}
