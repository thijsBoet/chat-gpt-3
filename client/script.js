import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat-container');

let loadInterval;

function loader(element) {
	element.textContent = '';

	loadInterval = setInterval(() => {
		element.textContent += '.';

		if (element.textContent.length > 3) {
			element.textContent = '';
		}
	}, 300);
}

function typeText(element, text) {
	let index = 0;

	let typeInterval = setInterval(() => {
		if (index < text.length) {
			element.textContent += text.chartAt(index);
			index++;
		} else {
			clearInterval(typeInterval);
		}
	}, 20);
}

const generateUniqueID = () => `id-${Date.now()}${Math.random().toString(16)}`;

function chatStripe(isAi, value, uniqueId) {
	return `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? bot : user}" 
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message" id='${uniqueId}'>
            <p>${value}</p>
          </div>
        </div>
      </div>
    `;
}

async function handleSubmit(event) {
	event.preventDefault();

	const data = new FormData(form);

	chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

	form.reset();

	const uniqueId = generateUniqueID();
	chatContainer.innerHTML += chatStripe(data, ' ', uniqueId);

	chatContainer.scrollTop = chatContainer.scrollHeight;

	const messageDiv = document.getElementById(uniqueId);

	loader(messageDiv);
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', e => {
	if (e.keyCode === 13) {
		handleSubmit(e);
	}
});
