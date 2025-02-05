import productModel from "./models/productModels.js";

class ProductDao {
    async getAllProductsDao() {
        return await productModel.find().lean();
    }

    async getProductByIdDao(pid) {
        return await productModel.findById(pid);
    }

    async createProductDao(product) {
        return await productModel.create(product);
    }

    async updateProductDao(pid, update) {
        return await productModel.findByIdAndUpdate(pid, { $set: update }, { new: true });
    }

    async deleteProductDao(pid) {
        return await productModel.deleteOne({ _id: pid });
    }
}

export default ProductDao;
