import { jest } from '@jest/globals';
import supertest from 'supertest';
import dotenv from 'dotenv';

dotenv.config();

const requester = supertest('http://localhost:8080');

const testRegister = {
    first_name: 'Sebastian',
    last_name: 'Villa',
    age: 45,
    email: 'villa@gmail.com',
    password: '123456',
    role: 'premium'
};

// Credenciales de login (deben coincidir con los datos de registro)
const testLogin = {
    email: testRegister.email,
    password: testRegister.password
};

// Variables globales para almacenar el ID del usuario y el token
let userId = null;
let authToken = null;

// 📌 Crear usuario ANTES de cada prueba
beforeEach(async () => {
    console.log("📝 Creando usuario antes de la prueba...");
    const response = await requester.post('/api/users/register').send(testRegister);

    console.log("🔍 Respuesta del servidor:", response.status, response.body);

    expect(response.statusCode).toBe(200);
    userId = response.body.payload._id;
    console.log("🆔 Usuario creado con ID:", userId);
});

// 📌 Eliminar usuario DESPUÉS de cada prueba
afterEach(async () => {
    if (userId) {
        const response = await requester.delete(`/api/users/${userId}`);
        console.log("🗑️ Respuesta de eliminación:", response.status, response.body);
        userId = null;
    }
});

// 🔹 Test para obtener el usuario creado
test('Debe obtener el usuario creado', async () => {
    expect(userId).not.toBeNull();
    expect(userId).toBeDefined();

    const response = await requester.get(`/api/users/${userId}`);

    console.log("📥 Respuesta del servidor:", response.status, response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("succes");
    expect(response.body.payload).toHaveProperty("_id", userId);
    expect(response.body.payload).toHaveProperty("email", testRegister.email);
});

// 🔹 Test para actualizar el usuario
test('Debe actualizar el usuario correctamente', async () => {
    const newName = 'Thiago';
    
    // Enviar la actualización
    const response = await requester.put(`/api/users/${userId}`).send({ first_name: newName });

    console.log("📥 Respuesta del servidor:", response.status, response.body);
    
    // Verificar si la actualización fue exitosa
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    // Obtener el usuario actualizado
    const response2 = await requester.get(`/api/users/${userId}`);

    console.log("📥 Respuesta del servidor después de la actualización:", response2.status, response2.body);

    expect(response2.statusCode).toBe(200);
    expect(response2.body.status).toBe('succes');
    expect(response2.body.payload).toHaveProperty("first_name", newName);
    expect(response2.body.payload.first_name).toBe('Thiago')
});

// 🔹 Test de login
test('Debe permitir el login con credenciales correctas', async () => {
    const response = await requester.post('/api/users/login').send(testLogin);

    console.log("🔑 Respuesta del login:", response.status, response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");

    authToken = response.body.token;
    console.log("🛡️ Token recibido:", authToken);
});

// 🔹 Test para intentar registrar un usuario con el mismo email
test('Debe rechazar el registro con un email ya registrado', async () => {
    const response = await requester.post('/api/users/register').send(testRegister);
    
    console.log("❌ Respuesta de registro duplicado:", response.status, response.body);

    expect(response.statusCode).toBe(400); 
    expect(response.body.status).toBe("error");
});

// 🔹 Test de login con credenciales incorrectas
test('Debe rechazar el login con credenciales incorrectas', async () => {
    const response = await requester.post('/api/users/login').send({
        email: testRegister.email,
        password: 'contraseñaIncorrecta'
    });

    console.log("❌ Respuesta de login fallido:", response.status, response.body);

    expect(response.statusCode).toBe(401); 
    expect(response.body.status).toBe("error");
});



// 📌 Mensaje final
afterAll(async () => {
    console.log("✅ Pruebas finalizadas.");
});
