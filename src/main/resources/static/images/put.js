// 1. Открытие модалки и заполнение данных пользователя
async function showEditModal(id) {
    try {
        // Загружаем данные пользователя и список всех ролей параллельно
        const [userRes, rolesRes] = await Promise.all([
            fetch(`/api/admin/users/${id}`),
            fetch(`/api/admin/roles`)
        ]);

        if (!userRes.ok || !rolesRes.ok) throw new Error("Ошибка загрузки данных");

        const user = await userRes.json();
        const allRoles = await rolesRes.json();

        // Заполняем текстовые поля и скрытые ID
        document.getElementById('editId').value = user.id;
        document.getElementById('displayEditId').textContent = user.id;
        document.getElementById('editUserName').value = user.userName;
        document.getElementById('editFirstName').value = user.firstName;
        document.getElementById('editLastName').value = user.lastName;
        document.getElementById('editAge').value = user.age;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPassword').value = ""; // Очищаем поле пароля

        // Отрисовываем чекбоксы ролей
        const rolesContainer = document.getElementById('editRolesContainer');
        rolesContainer.innerHTML = ""; // Очистка старых данных

        allRoles.forEach(role => {
            const isChecked = user.roles.some(userRole => userRole.id === role.id);
            const roleNameShort = role.name.replace('ROLE_', '');

            rolesContainer.innerHTML += `
                <div class="form-check" style="margin-bottom: 5px;">
                    <input class="form-check-input" type="checkbox" value="${role.id}" 
                        id="editRole${role.id}" name="roles" data-name="${role.name}" 
                        ${isChecked ? 'checked' : ''}>
                    <label class="form-check-label" for="editRole${role.id}" style="font-size: 0.9rem; cursor: pointer;">
                        ${roleNameShort}
                    </label>
                </div>`;
        });

        // Показываем модалку (твоя кастомная логика через display)
        document.getElementById('editModal').style.display = 'block';

    } catch (error) {
        console.error("Ошибка при подготовке модалки:", error);
        alert("Не удалось загрузить данные пользователя");
    }
}

// 2. Обработка нажатия кнопки "Edit" (Submit формы)
document.getElementById('editUserForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    // Собираем отмеченные чекбоксы ролей
    const selectedRoles = [];
    const checkboxes = document.querySelectorAll('#editRolesContainer input[name="roles"]:checked');

    checkboxes.forEach(cb => {
        selectedRoles.push({
            id: parseInt(cb.value),
            name: cb.getAttribute('data-name')
        });
    });

    // Формируем JSON объект для отправки
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
            closeEditModalFunc(); // Закрываем модалку
            if (typeof getAllUsers === 'function') {
                getAllUsers(); // Обновляем таблицу (из get.js)
            } else {
                location.reload(); // Если функции нет, просто релоад
            }
        } else {
            const error = await response.json();
            alert("Ошибка сохранения: " + (error.message || "Неизвестная ошибка"));
        }
    } catch (err) {
        console.error("Ошибка при отправке PUT-запроса:", err);
    }
});

// 3. Функции закрытия модалки
function closeEditModalFunc() {
    document.getElementById('editModal').style.display = 'none';
}

// Привязываем закрытие к кнопкам (проверь, чтобы эти ID были в HTML)
if (document.getElementById('closeEditModal')) {
    document.getElementById('closeEditModal').onclick = (e) => { e.preventDefault(); closeEditModalFunc(); };
}
if (document.getElementById('cancelEditModal')) {
    document.getElementById('cancelEditModal').onclick = (e) => { e.preventDefault(); closeEditModalFunc(); };
}
