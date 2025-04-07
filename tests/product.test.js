// NODE_OPTIONS=--experimental-vm-modules npm test
import { expect, jest, test } from '@jest/globals';
import supertest from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI_TEST;
const requester = supertest('http://localhost:8080');

const testerUser = {
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_PASSWORD
}

let userId = null;
let authToken = null
let pid = null;

const testerProduct = {
    title: 'titleTest',
    description: 'descriptionTest',
    price: 100,
    code: 'ABC',
    stock: 5,
    status: true,
    category: '67bdee434d08c40deb6a84c8', //motorola category _id
    owner: testerUser.email,
    category_product: 'motorola',
};


beforeAll(async () => {
    console.log("🔐 Iniciando sesión del usuario de prueba...");

    // Logear
    const response = await requester.post("/api/users/login").send(testerUser);
    console.log("🔑 Respuesta del login:", response.status, response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.payload).toHaveProperty("_id");
    expect(response.body.payload).toHaveProperty("email", testerUser.email);

    userId = response.body.payload._id;
    authToken = response.body.token;
    console.log("🛡️ Token recibido:", authToken);
});

test('Debe crear un producto correctamente', async () => {
    const response = await requester
        .post('/api/products')
        .set('Cookie', [`coderCookieToken=${authToken}`])
        .send(testerProduct);

    console.log("🧪 Respuesta del producto creado:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");

    const producto = response.body.payload;

    pid = producto._id

    expect(producto).toHaveProperty('title', testerProduct.title);
    expect(producto).toHaveProperty('price', testerProduct.price);
    expect(producto).toHaveProperty('owner', testerProduct.owner);
});


test('Debe traerme el producto creado', async () => {
    const response = await requester.get(`/api/products/${pid}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");

    const producto = response.body.payload;

    expect(producto.title).toBe(testerProduct.title);
    expect(producto.price).toBe(testerProduct.price);
    expect(producto.code).toBe(testerProduct.code);
    expect(producto.owner).toBe(testerProduct.owner)
});

test('El producto recién creado debe aparecer en el listado general', async () => {
    const response = await requester.get('/api/products');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");

    const productos = response.body.payload;

    // Verifica que al menos uno de los productos tenga el mismo _id que el que creaste
    const productoEncontrado = productos.find(p => p._id === pid);

    expect(productoEncontrado).toBeDefined();
    expect(productoEncontrado).toMatchObject(testerProduct);
});

test('El producto debe actualizarce correctamente', async () => {
    const newTitle = 'titleTest2'
    const response = await requester.put(`/api/products/${pid}`).send({ title: newTitle });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    const producto = response.body.payload;

    expect(producto.title).toBe(newTitle)
});

test('El producto debe eliminarse correctamente', async () => {
    const response = await requester
    .delete(`/api/products/${pid}`)
    .set('Cookie', [`coderCookieToken=${authToken}`]);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    
    // Verificar que el producto ya no existe
    //const check = await requester.get(`/api/products/${pid}`);
    //expect(check.statusCode).toBe(500);
});

// NODE_OPTIONS=--experimental-vm-modules npm test tests/product.test.js