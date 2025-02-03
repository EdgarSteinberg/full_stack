import { isValidPassword } from "../../utils/cryptoUtil.js";
import userModel from "../models/userModels.js";

class UserService {

    async getAllUserService() {
        try {
            return await userModel.find();
        } catch (error) {
            throw new Error(`Error al obtener los usuarios: ${error.message}`)
        }
    }

    async getUserByIdService(uid) {
        try {
            const result = await userModel.findOne({ _id: uid });
            if (!result) {
                throw new Error(`Usuario no se encuentrado`)
            }
            return result;
        } catch (error) {
            throw new Error(`Error al obtener el usuario: ${error.message}`);
        }
    }

    async getUserByEmailService(email) {
        try {
            return await userModel.findOne({ email });
        } catch (error) {
            throw new Error(`Error al obtener el usuario por email: ${error.message}`);
        }
    }


    async createUserService(user) {
        const { first_name, last_name, age, email, password } = user;

        try {
            return await userModel.create({ first_name, last_name, age, email, password });
        } catch (error) {
            throw new Error(`Error al crear el usuario: ${error.message}`)
        }
    }

    async loginUserService(email, password) {
        try {
            const user = await this.getUserByEmailService(email);
            if (!user) throw new Error("Usuario no encontrado");

            const passwordMatch = await isValidPassword(user, password);
            if (!passwordMatch) throw new Error("Contraseña incorrecta");

            return {
                message: "Usuario logueado exitosamente",
                user
            };
        } catch (error) {
            throw new Error(`Error al logearse: ${error.message}`);
        }
    }
    
    async deleteUserService(uid) {
            try {
                const result = await userModel.deleteOne({ _id: uid });
                return {
                    message: "Usuario eliminado correctamente",
                    result
                }
            } catch (error) {
                throw new Error(`Error al eliminar el usuario: ${error.message}`)
            }
        }
    }

export default UserService; 