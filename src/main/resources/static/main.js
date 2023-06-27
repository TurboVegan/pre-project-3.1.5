const url = "http://localhost:8080/admin/"


async function getAdminPage() {
    let page = await fetch(url);
    if (page.ok) {
        let listAllUser = await page.json();
        loadAllUsersTable(listAllUser);
    }
}

function loadAllUsersTable(listAllUser) {
    let tableBody = document.getElementById('usersTableBody');
    let tableDataHtml = '';
    for (let user of listAllUser) {
        let roles = [];
        for (let role of user.roles) {
            roles.push(" " + role.name)
        }
        tableDataHtml +=
            `<tr>
    <td>${user.id}</td>
    <td>${user.username}</td>
    <td>${user.yearOfBirth}</td>
    <td>${roles}</td>
    <td>
        <button class="btn btn-primary btn-md" data-bs-toogle="modal"
        data-bs-target="#editModal"
        onclick="editModalData(${user.id})">Edit</button>
    </td>
        <td>
        <button class="btn btn-danger" data-bs-toogle="modal"
        data-bs-target="#deleteModal"
        onclick="deleteModalData(${user.id})">Delete</button>
    </td>
</tr>`
    }
    tableBody.innerHTML = tableDataHtml;
}

async function getMyUser() {
    let res = await fetch('/auth');
    let resUser = await res.json();
    userNavbarDetails(resUser);
}


function userNavbarDetails(resUser) {
    let userList = document.getElementById('authorizedUser');
    let roles = ''
    for (let role of resUser.roles) {
        roles += role.name + ' '
    }
    userList.insertAdjacentHTML('afterbegin', `
        <b>${resUser.username}</b> with roles: ${roles}`);
}



getAdminPage();
window.addEventListener('DOMContentLoaded', getMyUser);
window.addEventListener('DOMContentLoaded', loadUserTable);


const pills = document.querySelectorAll('.pill');
const pillsContent = document.querySelectorAll('.pillContent');
pills.forEach((clickedPill) => {
    clickedPill.addEventListener('click', async () => {
        pills.forEach((pill) => {
            pill.classList.remove('active');
        });
        clickedPill.classList.add('active');
        let pillID = clickedPill.getAttribute('id');
        await activePillContent(pillID);
    });
});

async function activePillContent(pillID) {
    pillsContent.forEach((clickedPillContent) => {
        clickedPillContent.classList.contains(pillID) ?
            clickedPillContent.classList.add('active') :
            clickedPillContent.classList.remove('active');
    })
}



const tabs = document.querySelectorAll('.adminTab');
const tabsContent = document.querySelectorAll('.adminTabContent');
tabs.forEach((clickedTab) => {
    clickedTab.addEventListener('click', async () => {
        tabs.forEach((tab) => {
            tab.classList.remove('active');
        });
        clickedTab.classList.add('active');
        let tabID = clickedTab.getAttribute('id');
        await activeTabContent(tabID);
    });
});

async function activeTabContent(tabID) {
    tabsContent.forEach((clickedTabContent) => {
        clickedTabContent.classList.contains(tabID) ?
            clickedTabContent.classList.add('active') :
            clickedTabContent.classList.remove('active');
    })
}



const form_new = document.getElementById('formForNewUser');

async function addNewUser(event) {
    event.preventDefault();
    let listOfRole = [];
    for (let i = 0; i < form_new.roleSelect.options.length; i++) {
        if (form_new.roleSelect.options[i].selected) {
            listOfRole.push({id: form_new.roleSelect.options[i].value,
                role: form_new.roleSelect.options[i].text});
        }
    }
    let method = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: form_new.username.value,
            yearOfBirth: form_new.yearOfBirth.value,
            password: form_new.password.value,
            roles: listOfRole
        })
    }
    let page = await fetch(url, method);
    if (page.ok) {
        form_new.reset();
        await getAdminPage();
        document.getElementById('newUserTab').classList.remove('active');
        document.getElementById('newUserFormView').classList.remove('active');

        document.getElementById('usersTableTab').classList.add('active');
        document.getElementById('usersTableView').classList.add('active');
    } else {
        alert('Username already exists. Change the USERNAME')
    }
}

async function newUserSubmitActivation() {
    form_new.addEventListener('submit', addNewUser);
}



async function loadUserTable() {
    let tableBody = document.getElementById('aboutUserTableBody');
    let page = await fetch('/auth');
    let currentUser;
    if (page.ok) {
        currentUser = await page.json();
    } else {
        alert(`Error, ${page.status}`)
    }
    let tableDataHtml = '';
    let roles = [];
    for (let role of currentUser.roles) {
        roles.push(" " + role.name)
    }
    tableDataHtml +=
        `<tr>
    <td>${currentUser.id}</td>
    <td>${currentUser.username}</td>
    <td>${currentUser.yearOfBirth}</td>
    <td>${roles}</td>
</tr>`
    tableBody.innerHTML = tableDataHtml;
}



const form_ed = document.getElementById('editingForm');
const id_ed = document.getElementById('id_ed');
const username_ed = document.getElementById('username_ed');
const yearOfBirth_ed = document.getElementById('yearOfBirth_ed');
const password_ed = document.getElementById('password_ed');




async function editModalData(id) {
    $('#editModal').modal('show');
    const urlDataEd = url + id;
    let usersPageEd = await fetch(urlDataEd);
    if (usersPageEd.ok) {
        await usersPageEd.json().then(user => {
            id_ed.value = `${user.id}`;
            username_ed.value = `${user.username}`;
            yearOfBirth_ed.value = `${user.yearOfBirth}`;
            password_ed.value = `${user.password}`;
        })
    } else {
        alert(`Error, ${usersPageEd.status}`)
    }
}

async function editUser() {
    let urlEdit = url + id_ed.value;
    let listOfRole = [];
    for (let i = 0; i < form_ed.rolesForEditing.options.length; i++) {
        if (form_ed.rolesForEditing.options[i].selected) {
            listOfRole.push({id: form_ed.rolesForEditing.options[i].value,
                name: form_ed.rolesForEditing.options[i].text});
        }
    }
    let method = {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: form_ed.editedUserId.value,
            username: form_ed.username.value,
            yearOfBirth: form_ed.yearOfBirth.value,
            password: form_ed.password.value,
            roles: listOfRole
        })
    }
    await fetch(urlEdit, method).then(() => {
        $('#editCloseBtn').click();
        getAdminPage();
    })
}

const form_del = document.getElementById('deletingForm');
const id_del = document.getElementById('id_del');
const username_del = document.getElementById('username_del');
const yearOfBirth_del = document.getElementById('yearOfBirth_del');
const password_del = document.getElementById('password_del');


async function deleteModalData(id) {
    $('#deleteModal').modal('show');
    const urlForDel = url + id;
    let usersPageDel = await fetch(urlForDel);
    if (usersPageDel.ok) {
        await usersPageDel.json().then(user => {
            id_del.value = `${user.id}`;
            username_del.value = `${user.username}`;
            yearOfBirth_del.value = `${user.yearOfBirth}`;
            password_del.value = `${user.password}`;
        })
    } else {
        alert(`Error, ${usersPageDel.status}`)
    }
}

async function deleteUser() {
    let urlDel = url + id_del.value;
    let method = {
        method: 'DELETE'
    }
    await fetch(urlDel, method).then(() => {
        $('#deleteCloseBtn').click();
        getAdminPage();
    })
}

