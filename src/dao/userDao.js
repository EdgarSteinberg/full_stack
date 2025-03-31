import userModel from "./models/userModels.js";

class UserDAO {
    // Obtenemos todos los usuarios
    async getAllUsersDao() {
        return await userModel.find().populate("cart").lean();
    }

    // Obtenemos el usuario por su ID
    async getUserByIdDao(uid) {
        return await userModel.findById(uid).populate("cart").exec();
    }

    // Obtenemos el usuario por su correo electrónico
    async getUserByEmailDao(email) {
        return await userModel.findOne({ email });
    }

    // Crea al usuario
    async createUserDao(userData) {
        return await userModel.create(userData);
    }

    // Actualiza al usuario
    async updatedDao(uid, userData) {
        return await userModel.findByIdAndUpdate(uid, { $set: userData }, { new: true });
    }

    // Sube los documentos del usuario
    async uploadDocsDao(uid, documents) {
        return await userModel.findByIdAndUpdate(uid, { $push: { documents: { $each: documents } } }, { new: true });
    }

    // Actualiza la coneccion
    async updatedLastConectionDao(uid, connection) {
        return await userModel.findByIdAndUpdate(uid, { $set: { last_connection: connection } }, { new: true });
    }
    
    // Elimina al usuario
    async deleteUserDao(uid) {
        return await userModel.deleteOne({ _id: uid });
    }
}

export default UserDAO;
