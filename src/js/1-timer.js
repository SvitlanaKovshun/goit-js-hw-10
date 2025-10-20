import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const daysEl = document.querySelector('span[data-days]');
const hoursEl = document.querySelector('span[data-hours]');
const minutesEl = document.querySelector('span[data-minutes]');
const secondsEl = document.querySelector('span[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];

    if (!picked) {
      userSelectedDate = null;
      startBtn.disabled = true;
      return;
    }

    if (picked.getTime() <= Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      userSelectedDate = null;
      startBtn.disabled = true;
      return;
    }

    userSelectedDate = picked;
    startBtn.disabled = false;
  },
});

startBtn.addEventListener('click', start);

function start() {
  if (!userSelectedDate || userSelectedDate.getTime() <= Date.now()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });
    startBtn.disabled = true;
    return;
  }

  input.disabled = true;
  startBtn.disabled = true;

  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  function updateTimer() {
    const now = Date.now();
    const msRemaining = userSelectedDate.getTime() - now;

    if (msRemaining <= 0) {
      clearInterval(timerId);
      timerId = null;
      renderTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      input.disabled = false;
      startBtn.disabled = true;
      return;
    }

    const time = convertMs(msRemaining);
    renderTime(time);
  }

  updateTimer();
  timerId = setInterval(updateTimer, 1000);
}

function renderTime({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
