console.log("Hello world!");

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading-container');
const chatsElement = document.querySelector('.chats');
const API_URL = 'http://localhost:5000/chats';

loadingElement.style.display = '';

listAllChats();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const chat = {
        name,
        content
    };
    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(chat),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
      .then(createdChat => {
          form.reset();
          setTimeout(() => {
            form.style.display = '';
          }, 5000);
          listAllChats();
        //   loadingElement.style.display = 'none';
      });
});

function listAllChats() {
    chatsElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(chats => {
            console.log(chats);
            chats.reverse();
            chats.forEach(chat => {
                const div = document.createElement('div');
                const header = document.createElement('h3');
                header.textContent = chat.name;
                const contents = document.createElement('p');
                contents.textContent = chat.content;
                const date = document.createElement('small');
                date.textContent = new Date(chat.created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                chatsElement.appendChild(div);
            });
            loadingElement.style.display = 'none';
        });
}