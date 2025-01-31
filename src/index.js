const suma = (n1, n2) => {
    return new Promise((resolve, rejected) => {
        if (n1 == 0 && n2 == 0) {
            return rejected(`Operacion innecesaria`);
        }
        if (n1 + n2 < 0) {
            return rejected(`La calculadora solo debe devolver valores positivos`);
        } else {
            return resolve(`El resultado de la suma es: ${n1 + n2}`);
        }
    });
}

const resta = (n1, n2) => {
    return new Promise((resolve, rejected) => {
        if (n1 == 0 && n2 == 0) {
            return rejected(`Operacion innecesaria`);
        }
        if (n1 - n2 < 0) {
            return rejected(`La calculadora solo debe devolver valores positivos`);
        } else {
            return resolve(`El resultado de la resta es: ${n1 - n2}`);
        }
    });
}

const multiplicar = (n1, n2) => {
    return new Promise((resolver, rejected) => {
        if (n1 <= 0 || n2 <= 0) {
            return rejected(`La calculadora solo debe devolver valores positivos`);
        } else {
            return resolver(`El resultado de la multiplicacion ${n1 * n2}`)
        }
    })
}

const dividir = (n1, n2) => {
    return new Promise((resolver, rejected) => {
        if (n1 <= 0 || n2 <= 0) {
            return rejected(`La calculadora solo debe devolver valores positivos`);
        } else {
            return resolver(`El resultado de la division es:  ${n1 / n2}`)
        }
    })
}


const asincrona = async () => {
    try {
        const resultadoSuma = await suma(1, 1); // Pasando dos valores para la suma
        console.log(resultadoSuma);

        const resultadoResta = await resta(1, 1); // Pasando dos valores para la resta
        console.log(resultadoResta);

        const resultadoMultiplicacion = await multiplicar(3, 3);
        console.log(resultadoMultiplicacion);

        const resultadDividir = await dividir(4, 2); // Pasando dos valores para la resta
        console.log(resultadDividir);
    } catch (error) {
        console.log(error);
    }
}

asincrona();
