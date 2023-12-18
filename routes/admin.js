const express = require('express');
const adminRouter = express.Router();
const admin = require('../middleware/admin');
const { Product } = require('../models/product');
const Order = require('../models/order');

adminRouter.post("/admin/add-product", admin, async(req, res)=> {
    try {
        const { name, description, images, quantity, price, category } = req.body;
        let product = new Product(
            {
                name: name,
                description: description,
                quantity: quantity,
                images: images,
                category: category,
                price: price
            }
        );
        product = await product.save();
        res.status(200).json(product);
    } catch(e) {
        res.status(500).json({ error: e.message});
    }
});

// get all products
adminRouter.get('/admin/get-products', admin, async(req, res)=>{
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch(e) {
        res.status(500).json({ error: e.message});
    }
})

// delete the product
adminRouter.post('/admin/delete-product', admin, async(req, res)=>{
    try {
        const { productId } = req.body;
        let product = await Product.findByIdAndDelete(productId);  
        res.status(200).json(product);
    } catch(e) {
        res.status(500).json({ error: e.message});
    }
});

// get all orders
adminRouter.get('/admin/get-orders', admin, async(req, res)=>{
    try {
        const orders = await Order.find({});
        res.status(200).json(orders);
    } catch(e) {
        res.status(500).json({ error: e.message});
    }
})

// change order status
adminRouter.post('/admin/change-order-status', admin, async(req, res)=>{
    try {
        const { orderId, status } = req.body;
        let order = await Order.findById(orderId);  
        order.status = status;
        order = order.save();
        res.status(200).json(order);
    } catch(e) {
        res.status(500).json({ error: e.message});
    }
});

// analytics --> total earnings
adminRouter.get("/admin/analytics", admin, async(req, res)=>{
    try {
        const orders = await Order.find({});
        let totalEarnings = 0;

        for(let i=0; i<orders.length; i++) {
            for(let j=0; j<orders.products.length; j++) {
                totalEarnings += orders[i].products[j].quantity * orders[i].products[j].product.price;
            }
        }

        // Category wise earnings
        let mobileEarnings = await fetchCategoryWiseProduct("Mobiles");
        let essentialsEarnings = await fetchCategoryWiseProduct("Essentials");
        let appliancesEarnings = await fetchCategoryWiseProduct("Appliances");
        let booksEarnings = await fetchCategoryWiseProduct("Books");
        let fashionEarnings = await fetchCategoryWiseProduct("Fashion");

        let earnings = {
            totalEarnings,
            mobileEarnings,
            essentialsEarnings,
            appliancesEarnings,
            booksEarnings,
            fashionEarnings
        }

        res.status(200).json(earnings);
    } catch(e) {
        res.status(500).json({ error: e.message});
    }
})

const fetchCategoryWiseProduct = async (category)=>{
    let categoryOrders = await Order.find({ 'products.product.category': category });
    let earnings = 0;

    for(let i=0; i<categoryOrders.length; i++) {
        for(let j=0; j<categoryOrders.products.length; j++) {
            earnings += categoryOrders[i].products[j].quantity * categoryOrders[i].products[j].product.price;
        }
    }
    return earnings;
}
module.exports = adminRouter;
