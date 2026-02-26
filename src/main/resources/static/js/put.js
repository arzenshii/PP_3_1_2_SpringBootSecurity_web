async function showEditModal(id) {
    try {
        const [userRes, rolesRes] = await Promise.all([
            fetch(`/api/admin/users/${id}`),
            fetch(`/api/admin/roles`)
        ]);

        if (!userRes.ok || !rolesRes.ok) throw new Error("Error loading data");

        const user = await userRes.json();
        const allRoles = await rolesRes.json();

        document.getElementById('editId').value = user.id;
        document.getElementById('displayEditId').textContent = user.id;
        document.getElementById('editUserName').value = user.userName;
        document.getElementById('editFirstName').value = user.firstName;
        document.getElementById('editLastName').value = user.lastName;
        document.getElementById('editAge').value = user.age;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPassword').value = "";

        const rolesContainer = document.getElementById('editRolesContainer');
        rolesContainer.innerHTML = "";

        allRoles.forEach(role => {
            const isChecked = user.roles.some(userRole => userRole.id === role.id);
            const roleNameShort = role.name.replace('ROLE_', '');

            rolesContainer.innerHTML += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${role.id}" 
                        id="editRole${role.id}" name="roles" data-name="${role.name}" 
                        ${isChecked ? 'checked' : ''}>
                    <label class="form-check-label" for="editRole${role.id}">
                        ${roleNameShort}
                    </label>
                </div>`;
        });

        document.getElementById('editModal').style.display = 'block';

    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.getElementById('editUserForm');

    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const selectedRoles = [];
            const checkboxes = document.querySelectorAll('#editRolesContainer input[name="roles"]:checked');

            checkboxes.forEach(cb => {
                selectedRoles.push({
                    id: parseInt(cb.value),
                    name: cb.getAttribute('data-name')
                });
            });

            const updatedUser = {
                id: document.getElementById('editId').value,
                userName: document.getElementById('editUserName').value,
                firstName: document.getElementById('editFirstName').value,
                lastName: document.getElementById('editLastName').value,
                age: document.getElementById('editAge').value,
                email: document.getElementById('editEmail').value,
                password: document.getElementById('editPassword').value,
                roles: selectedRoles
            };

            try {
                const response = await fetch('/api/admin/users', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedUser)
                });

                if (response.ok) {
                    closeEditModalFunc();
                    if (typeof getAllUsers === 'function') {
                        getAllUsers();
                    } else {
                        location.reload();
                    }
                } else {
                    const error = await response.json();
                    alert(error.message || "Error");
                }
            } catch (err) {
                console.error(err);
            }
        });
    }
});

function closeEditModalFunc() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

document.querySelectorAll('#closeEditModal, #cancelEditModal').forEach(btn => {
    btn.onclick = (e) => {
        e.preventDefault();
        closeEditModalFunc();
    };
});
