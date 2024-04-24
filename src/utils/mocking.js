const { faker } = require('@faker-js/faker');

const generateProds = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 5, max: 150, precision: 0.01 }),
        img: faker.image.url(),
        tumbnail: faker.image.url(),
        code: faker.commerce.isbn(10),
        stock: faker.number.int({ min: 0, max: 100 }),
        category: faker.commerce.productAdjective(),
        status: faker.datatype.boolean()
    }
};

module.exports = generateProds;



