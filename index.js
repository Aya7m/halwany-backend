import express from 'express'
import { connectDB } from './lib/connectionDB.js'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoute from './routers/auth.route.js'
import productRoute from './routers/product.route.js'
import cartRouter from './routers/cart.route.js'
import paymentRoute from './routers/payment.route.js'
import reviewRouter from './routers/review.router.js'
import coupenRouter from './routers/coupen.routes.js'


dotenv.config()

const app = express()
const port = process.env.PORT || 5000







app.use(cors({
    origin: "http://localhost:3000", // أو دومين موقعك بعد النشر
    credentials: true // لو بتستخدمي الكوكيز أو الهيدر فيه بيانات حساسة
}));

app.use(express.json({ limit: "50mb" }))

app.use('/auth', authRoute)
app.use('/product', productRoute)
app.use('/cart', cartRouter)
app.use('/payment', paymentRoute)
app.use('/review', reviewRouter)
app.use('/coupen', coupenRouter)
connectDB()


app.use('/auth', authRoute)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))