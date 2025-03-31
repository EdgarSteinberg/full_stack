import messageModels from "./models/messageModels.js";

class MessageDao {

    async getMessageDao() {  // Cambié el nombre a plural para coherencia
        return await messageModels.find();
    }

    async getMessageByIdDao(mid) {
        return await messageModels.findById(mid); // Más directo
    }

    async createMessageDao(message) {
        return await messageModels.create(message);
    }

    async updateMessageDao(mid, updated) { // Corregido el typo en el nombre
        return await messageModels.findByIdAndUpdate(
            mid,
            { $set: updated },
            { new: true } // Devuelve el documento actualizado
        );
    }

    async deleteMessageDao(mid) {
        return await messageModels.deleteOne({ _id: mid });
    }

}

export default MessageDao;
