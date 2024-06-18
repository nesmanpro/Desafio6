// Instancia de socket.io del lado del cliente
const socket = io();
const role = document.getElementById("role").textContent;
const email = document.getElementById("email").textContent;


// Recibimos los productos del servidor:

socket.on('products', (data) => {
    showProds(data);
})

// Funcion montar trabla de cards prods

const showProds = (products) => {
    const prodCont = document.getElementById('prodCont');
    prodCont.innerHTML = '';

    products.docs.forEach(itm => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
        <div class="card cardFront">
            <img src="https://dspncdn.com/a1/media/originals/01/37/b6/0137b6c4bb21f01f395f0c975f03e651.jpg" alt="furniture">
            <div class="text">
                <h2>${itm.title}</h2>
                
                <strong>${itm.description}</strong>
                <p>Price: <strong>${itm.price}</strong> $ <br>By:<strong> ${itm.owner}</strong></p>
                <button type="button">Delete</button>
            </div>
        </div>`;
        prodCont.appendChild(card);

        card.querySelector('button').addEventListener('click', () => {
            if (role === "premium" && itm.owner === email) {
                deleteProd(itm._id);
                Swal.fire({
                    title: "Succes",
                    text: "El producto fue eliminado",
                    icon: "success",
                })
            } else if (role === "admin") {
                deleteProd(itm._id);
                Swal.fire({
                    title: "Succes",
                    text: "El producto fue eliminado",
                    icon: "success",
                })
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No tenes permiso para borrar ese producto",
                })
            }


        });

    });
}

// Eliminar Prod
const deleteProd = (id) => {
    socket.emit('deleteProd', id)
}

// Agregar Prod
document.getElementById('btnSend').addEventListener('click', () => {
    addProd();
})

const addProd = () => {

    const owner = role === "premium" ? email : "admin";

    const prod = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        img: document.getElementById('img').value,
        code: document.getElementById('code').value,
        stock: parseInt(document.getElementById('stock').value, 10),
        category: document.getElementById('category').value,
        status: document.getElementById('status').value === 'active',
        owner
    };

    socket.emit('addProd', prod);
}