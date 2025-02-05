import userModel from "./models/userModels.js";

class UserDAO {
    async getAllUsersDao() {
        return await userModel.find();
    }

    async getUserByIdDao(uid) {
        return await userModel.findById(uid);
    }

    async getUserByEmailDao(email) {
        return await userModel.findOne({ email });
    }

    async createUserDao(userData) {
        return await userModel.create(userData);
    }

    async deleteUserDao(uid) {
        return await userModel.deleteOne({ _id: uid });
    }
}

export default UserDAO;
