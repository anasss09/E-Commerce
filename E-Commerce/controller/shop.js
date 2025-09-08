const products = require("../model/products");
const Users = require("../model/user");

// module.exports.getProductAll = async (req, res) => {
// 	if(!req.isAuthenticated()) return res.redirect('/login')
// 	try {
// 		let product = await products.find();
// 		const { getPtoductCategoryWise } = require("../utils/library");
// 		let categoryProduct = getPtoductCategoryWise(product);
// 	} catch (err) {}
// };

module.exports.getHome = async (req, res) => {
	if(!req.isAuthenticated()) return res.redirect('/login')
	try {
		let product = await products.find();
		const { getPtoductCategoryWise } = require("../utils/library");
		let categoryProduct = getPtoductCategoryWise(product);
		// console.log(req.user);
		res.render("shop/home", {
			Product: categoryProduct,
            isLoggedIn: true,
            isAdmin: (req.user.role == 'admin') ? true : false
		});
	} catch (err) {}
};

module.exports.getProductsById = async (req, res) => {
	try {
		let { id } = req.params;
		let product = await products.findOne({ _id: id });
		res.render("shop/product-details", {
			Product: product,
            isLoggedIn: true,
            isAdmin: (req.user.role == 'admin') ? true : false
		});
	} catch (err) {}
};

module.exports.getAddToCartById = async (req, res, next) => {
	try {
		let { id } = req.params;
		let cart = req.user.cart;
		let indx = -1;
		cart.forEach((item, i) => {
			if (item.id == id) {
				indx = i;
			}
		});

		if (indx == -1) {
			cart.unshift({
				id: id,
				quantity: 1,
			});
		} else {
			cart[indx].quantity++;
		}

		await req.user.save();
		res.redirect("/shop/cart");
	} catch (err) {
		next(err);
	}
};

module.exports.getCart = async (req, res, next) => {
	if(!req.isAuthenticated()) return res.redirect('/login')
	try {
		let { id } = req.params;
		let user = await Users.findOne({ _id: req.user._id }).populate("cart.id");

		let totalPrice = 0;
		user.cart.forEach((item) => {
			totalPrice += item.id.price * item.quantity;
		});
		res.render("shop/cart", {
			cart: user.cart,
			totalPrice,
            isLoggedIn: true,
            isAdmin: (req.user.role == 'admin') ? true : false
		});
	} catch (err) {
		next(err);
	}
};

module.exports.getIncrease = async (req, res, next) => {
	const { id } = req.params;
	const cart = req.user.cart;
	let indx;
	cart.forEach((item, i) => {
		if (item.id == id) {
			indx = i;
		}
	});

	cart[indx].quantity++;
	await req.user.save();
	try {
		let user = await Users.findOne({ _id: req.user.id }).populate("cart.id");
		let totalPrice = 0;
		user.cart.forEach((item) => {
			totalPrice += item.id.price * item.quantity;
		});
		res.send({
			id: user.cart,
			totalPrice,
            isAdmin: (req.user.role == 'admin') ? true : false
		});
	} catch (err) {
		next(err);
	}
};

module.exports.getDecrease = async (req, res, next) => {
	const { id } = req.params;
	const cart = req.user.cart;
	let indx;
	cart.forEach((item, i) => {
		if (item.id == id) {
			indx = i;
		}
	});

	if (cart[indx].quantity > 1) cart[indx].quantity--;
	else if (cart[indx].quantity == 1) cart.splice(indx, 1);

	await req.user.save();
	try {
		let user = await Users.findOne({ _id: req.user.id }).populate("cart.id");
		let totalPrice = 0;
		user.cart.forEach((item) => {
			totalPrice += item.id.price * item.quantity;
		});
		res.send({
			id: user.cart,
			totalPrice,
			isAdmin: (req.user.role == 'admin') ? true : false
		});
	} catch (err) {
		next(err);
	}
};

module.exports.getCartBuy = async (req, res, next) => {
    try {
        let user = await Users.findOne({ _id: req.user._id }).populate('cart.id');

        let cart = user.cart;
        // console.log("CART", cart)
        let myOrder = req.user.orders || [];
		// console.log("Before ", myOrder)

        // console.log("Before", myOrder);
        let newOrder = [];
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            let order = {};
            let product = await products.findOne({ _id: item.id });
            order.product = product;
			// console.log("\n \n \n \n \n \n \n Product", order.product);
			
            order.quantity = item.quantity;
            order.totalPrice = order.product.price * order.quantity;
            // console.log("Order ", order);
            newOrder.push(order);
        }
		// console.log("New Order", newOrder)
		// console.log("\n\n\n\n\n\n\n\n", newOrder + "\n\n\n\n\n\n\n");


        // newOrder.forEach((item) => {
        //     myOrder.unshift(item);
		// 	console.log("Itrative ", myOrder);
			
        // })
		
		for(let i=0; i < newOrder.length; i++) {
			myOrder.unshift(newOrder[i])
			console.log("New Order Ith",newOrder[i]);
		}
		// // console.log("MY ORDERS: ", myOrder)
		

        await Users.updateOne({
            _id: req.user._id
        }, {
            orders: myOrder,
            cart: []
        })

		// res.send({
		// 	orders: req.user.orders
		// })
        res.redirect('/shop/order/history')


    } catch (err) {
        next(err);
    }
}


module.exports.getOrderHistory = (req, res, next) => {
    try {
        let orders = req.user.orders;
		console.log(orders);
		
        res.render('shop/orders', {
            orders: orders,
            isLoggedIn: true
        })
    } catch (err) {

    }
}
