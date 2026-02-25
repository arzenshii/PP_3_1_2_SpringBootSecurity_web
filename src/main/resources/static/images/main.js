const url = '/api/admin/users';

function getAllUsers() {
    fetch(url)
        .then(res => res.json())
        .then(users => {
            let tableBody = document.getElementById("allUsersTableBody");
            let temp = "";
            users.forEach(user => {
                let roles = user.roles.map(r => r.name.replace('ROLE_', '')).join(' ');

                temp += `<tr>
                    <td>${user.id}</td>
                    <td>${user.userName}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${roles}</td>
                    <td>
                        <button class="btn btn-info btn-sm text-white" onclick="showEditModal(${user.id})">Edit</button>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="showDeleteModal(${user.id})">Delete</button>
                    </td>
                </tr>`;
            });
            tableBody.innerHTML = temp;
        })
}

getAllUsers();
