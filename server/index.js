const express = require('express')
const Razorpay = require('razorpay');
const crypto = require("crypto");
const uuid = require('uuid').v4

require('dotenv').config()
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000

const instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })
app.use(express.json())
app.use(cors())
app.post('/checkout', (req, res) => {

    const options = {
        amount: req.body.amount*100,
        currency: "INR",
        receipt: uuid()
    };

    instance.orders.create(options, function (err, order) {
        res.status(200).json(order)
    });
})

app.post('/verify', (req, res) => {
    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET).update(body.toString()).digest('hex');
    if (expectedSignature === req.body.response.razorpay_signature) {
        res.status(200).json({ msg: 'Signature verified' })
    }
    else {
        res.status(500).json({ msg: 'Invalid Signature. Not Valid' })
    }
})


app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})