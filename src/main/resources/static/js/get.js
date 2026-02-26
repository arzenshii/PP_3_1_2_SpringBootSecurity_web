const userUrl = '/api/admin/users';
const rolesUrl = '/api/admin/roles';

async function getAllUsers() {
    const res = await fetch(userUrl);
    const users = await res.json();
    const tableBody = document.getElementById("allUsersTableBody");
    let temp = "";
    users.forEach(user => {
        const roles = user.roles.map(r => r.name.replace('ROLE_', '')).join(' ');
        temp += `
        <tr>
            <td>${user.id}</td>
            <td>${user.userName}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${roles}</td>
            <td><button class="btn btn-info btn-sm text-white" onclick="showEditModal(${user.id})">Edit</button></td>
            <td><button class="btn btn-danger btn-sm" onclick="showDeleteModal(${user.id})">Delete</button></td>
        </tr>`;
    });
    tableBody.innerHTML = temp;
}

async function getRolesList() {
    const res = await fetch(rolesUrl);
    return await res.json();
}
