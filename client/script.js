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
			element.textContent += text.charAt(index);
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
						src=${isAi ? bot : user} 
						alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
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

	const response = await fetch('https://chat-gpt-3-osfm.onrender.com/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			prompt: data.get('prompt'),
		}),
	});

	clearInterval(loadInterval);
	messageDiv.innerHTML = '';

	if (response.ok) {
		const data = await response.json();
		const parsedData = data.bot.trim();

		typeText(messageDiv, parsedData);
	} else {
		const error = await response.text();
		typeText(messageDiv, 'Something went wrong!');

		alert(error)
	}
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', e => {
	if (e.keyCode === 13) {
		handleSubmit(e);
	}
});
