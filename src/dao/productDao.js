import productModel from "./models/productModels.js";
import categorieModels from "./models/categorieModels.js";


class ProductDao {
    // Obtener todos los productos sin populación
    async getAllProductsDao() {
        return await productModel.find().lean();
    }

    // Obtener un producto por ID
    async getProductByIdDao(pid) {
        return await productModel.findById(pid).populate("category").lean(); // También populando la categoría aquí si es necesario
    }

    // Obtener productos con la categoría poblada
    async getALLCategoryProductDao() {
        return await productModel.find().populate("category").lean(); // Asegúrate de agregar .lean() si no necesitas un documento completo
    }

    // Obtener productos con la categoría poblada
    async getALLCategoryProductByIdDao(category_name) {
        // Buscar la categoría por nombre para obtener su _id
        const category = await categorieModels.findOne({ category_name }).lean();
        
        if (!category) return []; // Si no existe la categoría, devolvemos un array vacío
    
        // Buscar productos con la categoría poblada
        return await productModel
            .find({ category: category._id }) // Filtramos por el ObjectId de la categoría
            .populate({
                path: "category",  // 🔥 Popula la categoría
                select: "category_name category_image " // Solo traemos lo necesario
            })
            .lean();
    }
    
    // Crear un nuevo producto
    async createProductDao(product) {
        return await productModel.create(product);
    }

    // Actualizar un producto existente
    async updateProductDao(pid, update) {
        return await productModel.findByIdAndUpdate(pid, { $set: update }, { new: true });
    }

    // Eliminar un producto por ID
    async deleteProductDao(pid) {
        return await productModel.deleteOne({ _id: pid });
    }
}

export default ProductDao;
