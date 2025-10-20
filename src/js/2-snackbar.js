import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const delayInput = form.querySelector('input[name="delay"]');
const submitButton = form.querySelector('button[type="submit"]');

function getDelayValue() {
  const raw = delayInput.value;
  const delay = Number(raw);

  if (Number.isNaN(delay) || delay <= 0) {
    return null;
  }

  return Math.trunc(delay);
}

function getSelectedState() {
  const checked = form.querySelector('input[name="state"]:checked');
  return checked ? checked.value : null;
}

function createDelayedPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();

  const delay = getDelayValue();
  const state = getSelectedState();

  if (delay === null) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a positive number of milliseconds',
    });
    return;
  }

  if (!state) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please select a state (fulfilled or rejected)',
    });
    return;
  }

  submitButton.disabled = true;

  createDelayedPromise(delay, state)
    .then(delay => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`,
      });
    })
    .catch(d => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
      });
    })
    .finally(() => {
      submitButton.disabled = false;
    });
}
