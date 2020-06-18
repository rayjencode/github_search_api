class Github {
    constructor() {
        this.client_iD = 'd08d83d147ea14a98c12';
        this.client_secret = 'ddcc7be17f85eeab24155319960c3c8982a35689';
        this.base = 'https://api.github.com/users';
    }

    async ajax(value) {
        const userUrl = `${this.base}/${value}`;
        const reposURL = `${this.base}/${value}/repos?`;

        const userData = await fetch(userUrl);
        const user = await userData.json();

        const reposData = await fetch(reposURL);
        const repos = await reposData.json();

        return {
            user,
            repos,
        };
    }
}

class UI {
    constructor() {
        this.userImage = document.getElementById('userImg');
        this.feedback = document.querySelector('.feedback');
    }

    getUser(user) {
        const validation = new Validation();
        const {
            avatar_url: image,
            html_url: link,
            public_repos: repos,
            name,
            login,
            message,
        } = user;

        if (message === 'Not Found') {
            validation.showFeedback(`User ${message}`, this.feedback);
        } else {
            this.showUser(image, link, repos, name, login);
        }
    }

    displayRepos(userID, repos) {
        console.log(userID);
        // console.log(repos);

        const reposBtn = document.querySelectorAll('[data-id]');

        reposBtn.forEach((btn) => {
            if (btn.dataset.id === userID) {
                const parent = btn.parentNode;

                repos.forEach((repo) => {
                    const p = document.createElement('p');
                    p.innerHTML = `<p><a href="${repo.html_url}" target="_blank">${repo.name}</a></p>`;
                    parent.appendChild(p);
                });
            }
        });
    }

    showUser(image, link, repos, name, login) {
        const list = document.getElementById('userList');

        const div = document.createElement('div');
        div.className = `row single-user my-3`;
        div.innerHTML = `
        <div class="col-sm-6 col-md-4 user-photo my-2">
        <img
            id="userImg"
            src="${image}"
            class="img-fluid"
            alt="${name}"
        />
    </div>
    <div
        class="col-sm-6 col-md-4 user-info text-capitalize my-2"
    >
        <h6>name : <span>${name}</span></h6>
        <h6>
            blog :
            <a href="${login}" class="badge badge-primary"
                >blog</a
            >
        </h6>
        <h6>
            github :
            <a href="${link}" class="badge badge-primary"
                >link</a
            >
        </h6>
        <h6>
            public repos :
            <span class="badge badge-success">${repos}</span>
        </h6>
    </div>
    <div class="col-sm-6 col-md-4 user-repos my-2">
        <button
            type="button"
            id="getRepos"
            data-id="${login}"
            class="btn reposBtn text-capitalize mt-3"
        >
            get repos
        </button>
    </div>
        
        `;

        list.appendChild(div);
    }
}

class Validation {
    showFeedback(message, element) {
        element.textContent = message;
        element.classList.add('showItem');
        setTimeout(() => {
            element.textContent = '';
            element.classList.remove('showItem');
        }, 3000);
    }
}

(function () {
    const github = new Github();
    const ui = new UI();
    const validation = new Validation();

    const searchForm = document.getElementById('searchForm');
    const searchUser = document.getElementById('searchUser');
    const feedback = document.querySelector('.feedback');
    const list = document.getElementById('userList');

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const textValue = searchUser.value;

        if (textValue === '') {
            validation.showFeedback('Required Field!', feedback);
        } else {
            github
                .ajax(textValue)
                .then((data) => {
                    ui.getUser(data.user);
                })
                .catch((err) => console.log(err));
        }
    });

    list.addEventListener('click', (e) => {
        if (e.target.classList.contains('reposBtn')) {
            const userID = e.target.dataset.id;

            github.ajax(userID).then((data) => {
                ui.displayRepos(userID, data.repos);
            });
        }
    });
})();
