export function openPopup(popup) {
  if (!popup) return;
  popup.classList.add("popup_is-opened");

  document.addEventListener("keydown", handleEscClose);

  popup.addEventListener("click", handleOverlayClick);
}

export function closePopup(popup) {
  if (!popup) return;
  popup.classList.remove("popup_is-opened");

  document.removeEventListener("keydown", handleEscClose);
  popup.removeEventListener("click", handleOverlayClick);
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("popup")) {
    closePopup(evt.target);
  }
}
