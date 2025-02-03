import productModel from "../models/productModels.js";

class ProductService {

    async getAllproductsService() {
        try {
            return await productModel.find().lean();
        } catch (error) {
            throw new Error("Error al obtener los productos: " + error.message);
        }
    }

    async getproductByIdService(pid) {
        try {
            const product = await productModel.findOne({ _id: pid });
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            throw new Error("Error al obtener el producto: " + error.message);
        }
    }

    async createProductService(product) {
        const { title, description, price, code, stock, status, category, thumbnails } = product;

        try {
            return await productModel.create({ title, description, price, code, stock, status, category, thumbnails });
        } catch (error) {
            throw new Error("Error al crear el producto: " + error.message);
        }
    }

    async updateProductService(pid, update) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate({_id: pid}, { $set: update }, { new: true });
            if (!updatedProduct) {
                throw new Error("Producto no encontrado para actualizar");
            }
            return updatedProduct;
        } catch (error) {
            throw new Error("Error al actualizar el producto: " + error.message);
        }
    }


    async deleteProductService(pid) {
        try {
            const deleteProduct = await productModel.deleteOne({ _id: pid })
            if (!deleteProduct) {
                throw new Error("Producto no encontrado para eliminar")
            }
            return { message: "Producto eliminado correctamente", deleteProduct };
        } catch (error) {
            throw new Error("Error al eliminar el producto: " + error.message);
        }
    }
}

export default ProductService;