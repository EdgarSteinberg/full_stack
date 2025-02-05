// import ticketModel from "./models/ticketModel.js";

// class TicketDao {
//     async getAllTicketDao (){
//         return await ticketModel.find();
//     }

//     async getTicketByIdDao(tid){
//         return await ticketModel.findOne({_id: tid});
//     }

//     async createTicketDao(ticket){
//         return await ticketModel.create(ticket);
//     }

//     async deleteTicketDao(tik){
//         return await ticketModel.deleteOne({_id: tid});
//     }
    
// }

// export default TicketDao;


import ticketModel from "./models/ticketModel.js";

class TicketDao {
    async getAllTicketDao() {
        return await ticketModel.find().populate("purchaser").populate("cart.product"); // Popular referencias
    }

    async getTicketByIdDao(tid) {
        return await ticketModel.findOne({ _id: tid }).populate("purchaser").populate("cart.product");
    }

    async createTicketDao(ticket) {
        return await ticketModel.create(ticket);
    }

    async deleteTicketDao(tid) {
        return await ticketModel.deleteOne({ _id: tid });
    }
}

export default TicketDao;
