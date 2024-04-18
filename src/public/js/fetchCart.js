const deleteProductBtn = document.getElementById('deleteProds');
const emptyCartBtn = document.getElementById('emptyCart');

deleteProductBtn.addEventListener('click', function () {

    const cartId = this.getAttribute('data-cart-id');
    const productId = this.getAttribute('data-product-id');

    deleteProds(cartId, productId);
});

emptyCartBtn.addEventListener('click', function () {

    const cartId = this.getAttribute('delete-cart-id');

    emptyCart(cartId);
})


function deleteProds(cartId, productId) {
    fetch(`http://localhost:8080/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el producto del carrito');
            }
            location.reload();
            console.info('No hay Error con esto');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function emptyCart(cartId) {
    fetch(`http://localhost:8080/api/carts/${cartId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al vaciar el carrito');
            }
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}