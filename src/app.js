import express from 'express';
import productRouter from './routes/productRouter.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/products", productRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server start in http://localhost:${PORT}`)
});