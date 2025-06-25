function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add(settings.errorClass);
  }
}

function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove(settings.errorClass);
  }
}

function checkInputValidity(formElement, inputElement, settings) {
  if (inputElement.validity.valueMissing) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      settings
    );
    return false;
  }
  if (inputElement.validity.tooShort) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      settings
    );
    return false;
  }

  if (!inputElement.validity.valid) {
    if (inputElement.dataset.errorMessage) {
      showInputError(
        formElement,
        inputElement,
        inputElement.dataset.errorMessage,
        settings
      );
      return false;
    }
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      settings
    );
    return false;
  } else {
    hideInputError(formElement, inputElement, settings);
    return true;
  }
}

function toggleButtonState(inputs, button, settings) {
  const isValid = inputs.every((input) =>
    checkInputValidity(input.closest("form"), input, settings)
  );
  if (isValid) {
    button.classList.remove(settings.inactiveButtonClass);
    button.disabled = false;
  } else {
    button.classList.add(settings.inactiveButtonClass);
    button.disabled = true;
  }
}

function enableValidation(settings) {
  const forms = document.querySelectorAll(settings.formSelector);

  forms.forEach((form) => {
    const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
    const submitButton = form.querySelector(settings.submitButtonSelector);

    toggleButtonState(inputs, submitButton, settings);

    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        checkInputValidity(form, input, settings);
        toggleButtonState(inputs, submitButton, settings);
      });
    });

    form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      toggleButtonState(inputs, submitButton, settings);
    });
  });
}

function clearValidation(formEl, settings) {
  const inputs = Array.from(formEl.querySelectorAll(settings.inputSelector));
  const submitButton = formEl.querySelector(settings.submitButtonSelector);

  inputs.forEach((input) => {
    hideInputError(formEl, input, settings);
  });

  submitButton.classList.add(settings.inactiveButtonClass);
  submitButton.disabled = true;
}

export { enableValidation, clearValidation };
