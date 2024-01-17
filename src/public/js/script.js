console.log('Esta funcionando!');

const socket = io();

socket.emit('msn', 'hola mundo!');

// Recibimos los productos del servidor:

socket.on('products', (data) => {
    showProds(data);
})

// Funcion montar trabla de cards prods

const showProds = (products) => {
    const prodCont = document.getElementById('prodCont');
    prodCont.innerHTML = '';

    products.forEach(itm => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
        <h2>${itm.title}</h2>
        <img src="https://dspncdn.com/a1/media/originals/de/c8/d6/dec8d6ae8161e1dd55f6a2a261cbf767.jpg" alt="furniture">
        <p>Description:</p>
        <strong>${itm.description}</strong>
        <p>Price: <strong>${itm.price}</strong> $</p>
        <button> Delete Product </button>
        `;
        prodCont.appendChild(card);

        card.querySelector('button').addEventListener('click', () => {
            deleteProd(itm.id);
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
    const prod = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        img: document.getElementById('img').value,
        code: document.getElementById('code').value,
        stock: parseInt(document.getElementById('stock').value, 10),
        category: document.getElementById('category').value,
        status: document.getElementById('status').value === 'true'
    };

    socket.emit('addProd', prod);
}