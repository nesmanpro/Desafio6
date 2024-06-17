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

    users.forEach(itm => {
        const card = document.createElement('div');
        const now = new Date();
        card.classList.add('card');
        card.innerHTML = `
        <div class="card cardFront">
            <div class="text">
                <h2>${itm.first_name}</h2>
                
                <strong>${itm.email}</strong>
                <p><br>Role:<strong> ${itm.role}</strong></p>
                <p><br>Last connection:<strong> ${itm.last_connection}</strong></p>
                <button class="delete-btn" type="button">Delete</button>
                <br>
                <form>
                <label for="userRole">Select User Role:</label>
                <br>
                <select id="userRole" name="userRole">
                <option value="user">User</option>
                <option value="admin">Admin</option>
                </select>
                </form>
                <br>
                <button class="role-btn" type="button">Change Role</button>
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

            const user = { id: itm._id, role: itm.cart }

            if (email === itm.email) {

                Swal.fire({
                    title: "Error",
                    text: "No se ha podido cambiar el role",
                })
            } else {

                Swal.fire({
                    title: "Success",
                    text: "Role modificado correctamente",
                })
                // deleteUser(user);
            }

        });

    });
}

// Eliminar user
const deleteUser = (id) => {
    socket.emit('deleteUser', id)
}

// // Agregar Prod
// document.getElementById('btnSend').addEventListener('click', () => {
//     addProd();
// })

// const addProd = () => {

//     const user = {
//         role: document.getElementById('role').value,
//         owner
//     };

//     socket.emit('updateRole', user);
// }