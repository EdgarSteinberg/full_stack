import ProductDao from "../dao/productDao.js";
const productDao = new ProductDao();
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import UserManager from "./userManager.js";

const userManager = new UserManager();
dotenv.config();

const EMAIL = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;


class ProductManager {
    async getAllProducts() {
        return await productDao.getAllProductsDao();
    }

    async getProductById(pid) {
        return await productDao.getProductByIdDao(pid);
    }

    async getAllCategoryProduct() {
        return await productDao.getALLCategoryProductDao();
    }

    async getCategoryProduct(category) {
        return await productDao.getALLCategoryProductByIdDao(category);
    }

    async createProduct(product) {
        const { title, description, price, code, stock, category, thumbnails, status = true, owner, category_product } = product;

        if (!title || !description || !price || !code || !stock || !category || !thumbnails || !category_product) {
            throw new Error("Debes completar todos los campos obligatorios.");
        }

        try {
            const createdProduct = await productDao.createProductDao({ title, description, price, code, stock, category, thumbnails, status, owner, category_product });

            // return {
            //     message: "Producto creado correctamente",
            //     product: createdProduct
            // };
            return createdProduct
        } catch (error) {
            throw new Error(`Error al crear el producto: ${error.message}`);
        }
    }

    async updateProduct(pid, update) {
        try {
            const updatedProduct = await productDao.updateProductDao(pid, update);
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }


    async incrementarPurchases(productId, quantity = 1) {
        // Validamos la cantidad
        if (typeof quantity !== 'number' || quantity <= 0) {
            throw new Error(`La cantidad debe ser un número positivo. Recibido: ${quantity}`);
        }
    
        // Verificamos si el producto existe
        const producto = await productDao.getProductByIdDao(productId);
        if (!producto) {
            throw new Error(`El producto con ID: ${productId} no se encuentra`);
        }
    
        try {
            const updatedProduct = await productDao.incrementPurchasesDao(productId, quantity);
            return updatedProduct;
        } catch (error) {
            throw new Error("Error al incrementar la compra: " + error.message);
        }
    }
    

    async deleteProduct(pid) {
        try {
            const product = await productDao.getProductByIdDao(pid);
            if (!product) throw new Error(`Producto con ID: ${pid} no encontrado`);

            const ownerEmail = product.owner;
            console.log("producto delete", ownerEmail)
            
            //const user = await userManager.getUserByEmail(ownerEmail);
            // Si el usuario es premium, enviamos el correo
            // if (user && user.role === 'premium') {
            //     this.sendEmailProductDelete(ownerEmail, pid); // No usamos await aquí para no retrasar la eliminación
            // }
            if (ownerEmail !== "admin") {
                const user = await userManager.getUserByEmail(ownerEmail);
                if (user && user.role === 'premium') {
                    this.sendEmailProductDelete(ownerEmail, pid); // sin await
                }
            }
            // Eliminamos el producto y lo retornamos
            return await productDao.deleteProductDao(pid);

        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }


    async sendEmailProductDelete(email, productId) {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: EMAIL,
                pass: PASS
            }
        });

        await transport.sendMail({
            from: 'Edgar Steinberg <s.steinberg2019@gmail.com>',
            to: email,
            subject: 'Eliminación de Producto',
            html: `<div style="font-family: Arial, sans-serif; color: #333;">
                        <h1>Notificación de Eliminación de Producto</h1>
                        <p>El producto con ID ${productId} ha sido eliminado de la plataforma.</p>
                        <p>Si tienes alguna pregunta, por favor contáctanos.</p>
                        <p>Gracias,</p>
                        <p>El equipo de soporte de Tres Estrellas</p>
                        </div>`,
        });

    }
}

export default ProductManager;
