class ProductManager {
    constructor() {
        this.products = [];
    }

    // Obtener todos los productos
    async getAllProducts() {
        return this.products;
    }

    // Obtener un producto por ID
    async getProductById(id) {
        if (!id) throw new Error("Se debe proporcionar un ID válido.");

        const product = this.products.find(pr => pr.id === parseInt(id));

        if (!product) {
            throw new Error(`El producto con ID: ${id} no existe!`);
        }

        return product;
    }

    // Crear un nuevo producto
    async createProduct(product) {
        const { title, description, code, price, stock, status, category, thumbnails } = product;
    
        if (!title || !description || !code || !price || !stock || !status || !category || !thumbnails) {
            throw new Error("Todos los campos son obligatorios!");
        }
        if ((isNaN(price) || price <= 0) && (isNaN(stock) || stock < 0)) {
            throw new Error("El precio debe ser un número positivo y el stock debe ser mayor o igual a cero.");
        }
        try {
            // Debugging: Verifica si el ID se genera correctamente
            const newId = this.getId();
            //console.log("Nuevo ID generado:", newId); // Verifica el ID generado
            const newProduct = {
                id: newId, // Generar un ID único
                title,
                description,
                code,
                price,
                stock,
                status,
                category,
                thumbnails
            };
    
            console.log("Producto creado:", newProduct); // Verifica el producto antes de agregarlo
            this.products.push(newProduct); // Se agrega el producto al array
            return newProduct; // Se retorna el producto con el nuevo ID
        } catch (error) {
            console.error(`Error al crear el producto: ${error.message}`);
            throw error;
        }
    }
    
    async updateProduct(id, updates) {
        if (!id) throw new Error("Se debe proporcionar un ID válido.");

        // Encuentra el producto directamente
        const productFind = this.products.find(pr => pr.id === parseInt(id));

        if (!productFind) {
            throw new Error(`El producto con ID: ${id} no existe!`);
        }


        //const updates = { price: 150, stock: 40 };
        //for (const key in updates) {
        //  console.log(key); // 'price', 'stock'
        //  console.log(updates[key]); // 150, 40
        // }

        try {
            // Itera sobre las claves de "updates" y actualiza los campos en "productFind"
            for (const key in updates) {
                // Actualiza el campo del producto
                productFind[key] = updates[key];
            }

            return productFind; // Devuelve el producto actualizado
        } catch (error) {
            console.error(`Error al actualizar el producto: ${error.message}`);
            throw error;
        }
    }

    // Eliminar un producto
    async deleteProduct(id) {
        if (!id) throw new Error("Se debe proporcionar un ID válido.");

        const productFind = this.products.find(pr => pr.id === parseInt(id));

        if (!productFind) {
            throw new Error(`El producto con ID: ${id} no existe!`);
        }

        try {
            // Filtrar el array para eliminar el producto
            this.products = this.products.filter(pr => pr.id !== id);
            return { message: `Producto con ID: ${id} eliminado correctamente.` };
        } catch (error) {
            console.error(`Error al eliminar el producto: ${error.message}`);
            throw error;
        }
    }

    getId() {
        if (this.products.length > 0) {
            return this.products[this.products.length - 1].id + 1; // Obtiene el siguiente ID
        } else {
            return 1; // Primer ID
        }
    }
   
}

export default ProductManager;