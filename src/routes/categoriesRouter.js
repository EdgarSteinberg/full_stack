import { Router } from 'express';
import CategorieManager from '../controllers/categorieManager.js';
const categorieManager = new CategorieManager();

import { uploader } from '../utils/multer.js';

const router = Router();

router.get("/", async (req, res) => {

    try {
        const result = await categorieManager.getAllCategories();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});



router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await categorieManager.getCategoriesById(cid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ error: "error", message: error.message })
    }
});



router.post("/", uploader.fields([{ name: 'imgCategorie', maxCount: 5 }]), async (req, res) => {
    const { category_name } = req.body;

    const category_image = req.files['imgCategorie'] ? req.files['imgCategorie'].map(file => file.filename) : null;

    try {
        const result = await categorieManager.createCategories({ category_name, category_image });
        res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});



router.put("/:cid", uploader.fields([{ name: 'imgEdit', maxCount: 5 }]), async (req, res) => {
    const { cid } = req.params;

    // Obtener el nuevo nombre de la categoría y la imagen
    const { category_name } = req.body;  // Si se pasa un nombre nuevo
    const image = req.files['imgEdit'] ? req.files['imgEdit'].map(file => file.filename) : null;  // Si se pasa una nueva imagen

    // Si no hay ni imagen ni nombre, mostrar un error
    if (!category_name && !image) {
        return res.status(400).send({ status: "error", message: "Debe proporcionar un nombre o una imagen para la actualización." });
    }

    try {
        // Crear el objeto de actualización
        const updatedData = {
            category_name: category_name || undefined,  // Si no hay nombre, se mantiene el anterior
            category_image: image || undefined          // Si no hay imagen, se mantiene la anterior
        };

        const result = await categorieManager.updatedCategories(cid, updatedData);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});


router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await categorieManager.deleteCategories(cid);
        res.status(200).send({ status: "succes", payload: result });
    } catch (error) {
        res.status(500).send({ error: "error", message: error.message })
    }

})

export default router;