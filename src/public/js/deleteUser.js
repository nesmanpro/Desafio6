// Instancia de socket.io del lado del cliente
const socket = io();
const role = document.getElementById("role").textContent;
const email = document.getElementById("email").textContent;
// Recibimos los productos del servidor:

socket.on('users', (data) => {
    showUsers(data);
})

// Funcion montar trabla de cards prods

const showUsers = (users) => {
    const userCont = document.getElementById('userCont');
    userCont.innerHTML = '';

    const now = new Date();


    users.forEach(itm => {
        const card = document.createElement('div');

        const lastConnection = new Date(itm.last_connection);

        const diffInMs = now - lastConnection;
        const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));

        card.classList.add('card');
        card.innerHTML = `
        <div class="card cardFront">
            <div class="text">
                <div class="titleUser">
                    <h2>${itm.first_name}</h2>
                    <strong>${itm.email}</strong>
                    <p>Last connection:<br> <strong class='${diffInHours > 24 ? 'red' : ''}'>${diffInHours} hours ago</strong></p>
                </div>
                <div class="detailsUser">
                    <p>Role:<strong> ${itm.role}</strong></p>
                    
                    </div>
                    <div>
                    <form class="formUser">
                        <label for="userRole">Select User Role:</label>
                        <select id="${itm._id}" name="userRole">
                            <option value="user">User</option>
                            <option value="premium">Premium</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button class="role-btn btnSec3" type="button">Change Role</button>
                    </form>
                </div>
                <div>
                    <button class="delete-btn" type="button">Delete</button>
                </div>
            </div>
        </div>`;
        userCont.appendChild(card);

        card.querySelector('.delete-btn').addEventListener('click', () => {

            const user = { id: itm._id, cart: itm.cart }

            if (email === itm.email) {

                Swal.fire({
                    title: "Error",
                    text: "No puedes eliminarte a ti mismo",
                })
            } else {

                Swal.fire({
                    title: "Success",
                    text: "Usuario eliminado correctamente",
                })
                deleteUser(user);
            }

        });

        card.querySelector('.role-btn').addEventListener('click', () => {

            const role = document.getElementById(`${itm._id}`).value;


            if (email === itm.email) {

                Swal.fire({
                    title: "Error",
                    text: "No se ha podido cambiar el role",
                })

            } else {

                Swal.fire({
                    title: "Success",
                    text: "Role modificado correctamente",
                });

                updateRole(itm._id, role);

            }

        });

    });
}

// Eliminar user
const deleteUser = (id) => {
    socket.emit('deleteUser', id)
}


const updateRole = (id, role) => {

    const dataUser = {
        id: id,
        role: role
    }


    socket.emit('updateRole', dataUser);
}