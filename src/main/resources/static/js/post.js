async function addNewUser() {
    const form = document.getElementById('newUserForm');
    const selectedRoles = [];
    form.querySelectorAll('input[name="roles"]:checked').forEach(cb => {
        selectedRoles.push({ id: parseInt(cb.value), name: cb.dataset.name });
    });

    const newUser = {
        userName: form.userName.value,
        email: form.email.value,
        password: form.password.value,
        roles: selectedRoles
    };

    const res = await fetch(userUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    });

    if (res.ok) {
        form.reset();
        document.getElementById('users-table-tab').click(); // Переход на вкладку таблицы
        getAllUsers();
    }
}
