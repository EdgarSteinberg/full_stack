import express from 'express';

import productRouter from './routes/productRouter.js'
import cartRouter from './routes/cartRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server start in http://localhost:${PORT}`)
});