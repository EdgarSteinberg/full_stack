const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", function (e) {
    e.preventDefault();  
    login();
});

function login() {
    const data = {
        email: document.getElementById("email").value,  
        password: document.getElementById("password").value  
    };

    fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Se corrigió `headers`
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === "success") {
            alert("¡Login exitoso!");
            formulario.reset(); // Limpia el formulario
            window.location.href = "/dashboard.html"; // Redirigir a la página deseada
        } else {
            console.log("Error al iniciar sesión: " + (result.message || "Intente nuevamente"));
            alert("Error al iniciar sesión: " + (result.message || "Intente nuevamente"));
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema al iniciar sesión.");
    });
}




const formu = document.getElementById("formulario");

formu.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
});


const login = () => {
    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === "success") {
            alert("¡Login exitoso!");
            formulario.reset();
            window.location.href = "/dashboard.html";
        } else {
            console.log("Error al iniciar sesión:", result.message);
        }
    })
    .catch(error => console.log(error));
};
