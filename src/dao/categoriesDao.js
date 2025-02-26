import CategorieModels from "./models/categorieModels.js";

class CategoriesDao {

    // Obtener todas las categorías
    async getAllCategorieDao() {
        return await CategorieModels.find();
    }

    // Obtener una categoría por su ID
    async getCategorieByIdDao(id) {
        const category = await CategorieModels.findOne({ _id: id });
        if (!category) {
            throw new Error(`Categoría con ID ${id} no encontrada`);
        }
        return category;

    }

    // Crear una nueva categoría
    async createCategorieDao(categoryData) {
        return await CategorieModels.create(categoryData);
    }

    // Actualizar una categoría por ID
    async updatedCategorieDao(id, updated) {
        return await CategorieModels.findOneAndUpdate(
            { _id: id },  // Filtro
            updated,   // Nuevos datos
            { new: true }  // Devuelve la categoría actualizada
        );
    }

    // Eliminar una categoría por ID
    async deleteCategorieDao(id) {
        return await CategorieModels.deleteOne({ _id: id });
    }
}

export default CategoriesDao;
