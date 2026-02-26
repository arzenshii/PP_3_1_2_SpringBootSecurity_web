async function showDeleteModal(id) {
    const res = await fetch(`${userUrl}/${id}`);
    const user = await res.json();

    const modalBody = document.querySelector('#deleteModal .modal-body');
    modalBody.innerHTML = `
        <form class="text-center">
            <div class="mb-3">
                <label class="fw-bold">ID</label>
                <input type="text" class="form-control mx-auto" style="width: 300px;" value="${user.id}" disabled>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Username</label>
                <input type="text" class="form-control mx-auto" style="width: 300px;" value="${user.userName}" disabled>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Role</label>
                <input type="text" class="form-control mx-auto" style="width: 300px;" 
                    value="${user.roles.map(r => r.name.replace('ROLE_', '')).join(' ')}" disabled>
            </div>
        </form>`;

    document.querySelector('#deleteModal .modal-footer').innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>`;

    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

async function deleteUser(id) {
    const res = await fetch(`${userUrl}/${id}`, { method: 'DELETE' });
    if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        getAllUsers();
    }
}
