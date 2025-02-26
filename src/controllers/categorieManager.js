import CategoriesDao from "../dao/categoriesDao.js";

const categoriaDao = new CategoriesDao();

class CategorieManager {
    async getAllCategories() {
        return await categoriaDao.getAllCategorieDao();
    }

    async getCategoriesById(cid) {
        if (!cid) {
            throw new Error(`No se encontró el ID: ${cid}`);
        }
        try {
            return await categoriaDao.getCategorieByIdDao(cid);
        } catch (error) {
            throw new Error(`Error en el manager: ${error.message}`);
        }
    }

    async createCategories(categorie) {
        const { category_image, category_name } = categorie;

        if (!category_image && !category_name) {
            throw new Error("Falta category_name || category_image");
        }

        try {
            const result = await categoriaDao.createCategorieDao({ category_image, category_name });

            return result;

        } catch (error) {
            throw new Error(`Error al crear la categoría: ${error.message}`);
        }
    }

    async updatedCategories(cid, updated) {
        if (!cid || !updated) {
            throw new Error("Falta CID o UPDATED");
        }

        try {
            const result = await categoriaDao.updatedCategorieDao(cid, updated);
            return {
                message: "Categoría modificada",
                result
            };
        } catch (error) {
            throw new Error(`Error al editar la categoría: ${error.message}`);
        }
    }

    async deleteCategories(cid) {
        if (!cid) {
            throw new Error(`No se encontró el ID: ${cid}`);
        }

        try {
            const result = await categoriaDao.deleteCategorieDao(cid);
            return {
                message: "Categoría eliminada correctamente",
                result
            };
        } catch (error) {
            throw new Error(`Error al eliminar la categoría con ID: ${cid} - ${error.message}`);
        }
    }
}

export default CategorieManager;
