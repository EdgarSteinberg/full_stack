import MessageDao from "../dao/messageDao.js";
const messageDao = new MessageDao();

class MessageManager {

    async getMessage() {
        return await messageDao.getMessageDao();
    }

    async getMessageById(mid) {
        try {
            const result = await messageDao.getMessageByIdDao(mid);
            if (!result) throw new Error(`No se encontró el mensaje con ID: ${mid}`);
            return result;
        } catch (error) {
            throw new Error(`No se encontró el mensaje con ID: ${mid}`);
        }
    }

    async createMessage(messages) {
        const { first_name, last_name, email, message } = messages;

        if (!first_name || !last_name || !email || !message) {
            throw new Error(`Debes completar todos los campos`);
        }

        try {
            return await messageDao.createMessageDao({ first_name, last_name, email, message });
        } catch (error) {
            throw new Error("Error al crear el mensaje");
        }
    }

    async updateMessage(mid, updated) { // Nombre corregido
        const message = await this.getMessageById(mid); // Se agregó await
        if (!message) throw new Error(`El mensaje con ID: ${mid} no se encuentra`);

        if (!updated || updated === '') throw new Error("Debes agregar un comentario");

        try {
            return await messageDao.updateMessageDao(mid, updated); // Nombre corregido
        } catch (error) {
            throw new Error("No se actualizó el mensaje");
        }
    }

    async deleteMessage(mid) {
        const message = await this.getMessageById(mid); // Se agregó await
        if (!message) throw new Error(`El mensaje con ID: ${mid} no se encuentra`);

        try {
            return await messageDao.deleteMessageDao(mid);
        } catch (error) {
            throw new Error(`No se pudo eliminar el mensaje`);
        }
    }
}

export default MessageManager;
