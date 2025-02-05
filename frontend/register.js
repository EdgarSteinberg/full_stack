const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", createData);

async function createData(e) {
    e.preventDefault(); // Evita la recarga de la página

    // Obtener los valores de los inputs
    const data = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        age: document.getElementById("age").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch("http://localhost:8080/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === "success") {  // Corregido de "succes" a "success"
            alert("Usuario registrado correctamente!");
            formulario.reset(); // Limpiar el formulario
            
            // Redirigir a la página de login
            window.location.href = "/urban/frontend/login.html";
        } else {
            alert("Error en el registro: " + (result.message || "Intente nuevamente"));
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema en el registro");
    }
}


const formu = document.getElementById("formulario");

formu.addEventListener("submit", (e) => createData(e));

const createData = async (e) => {
    e.preventDefault(); // Evita la recarga de la página

    // Obtener los valores de los inputs
    const data = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        age: document.getElementById("age").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch("http://localhost:8080/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === "success") {  // Corregido de "succes" a "success"
            alert("Usuario registrado correctamente!");
            formulario.reset(); // Limpiar el formulario
            
            // Redirigir a la página de login
            window.location.href = "/urban/frontend/login.html";
        } else {
            alert("Error en el registro: " + (result.message || "Intente nuevamente"));
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema en el registro");
    }
};
