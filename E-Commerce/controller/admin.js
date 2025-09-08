const { isAdmin } = require("../middlewares/isAdmin");
const products = require("../model/products");

module.exports.getAdminHomePage = (req, res, next) => {
	if (!req.isAuthenticated()) return res.redirect("/login");
	res.render("admin/home");
};

module.exports.postProductAdd = async (req, res, next) => {
	const { name, price, description, seller, imageUrl, category } = req.body;
	await products.create({
		name,
		price,
		description,
		seller,
		imageUrl,
		category,
		isAdmin: true,
		isLoggedIn: true,
	});
	res.redirect("/admin/products/all");
};

module.exports.getProductAll = async (req, res, next) => {
	if (!req.isAuthenticated()) return res.redirect("/login");
	let Product = await products.find();

	let data = {};
	Product.forEach((product) => {
		let arr = data[product.category] || [];
		arr.push(product);
		data[product.category] = arr;
	});

	res.render("admin/product-list", {
		Product: data,
		isAdmin: true,
		isLoggedIn: true,
	});
};

module.exports.getProductAdd = (req, res) => {
	if (!req.isAuthenticated()) return res.redirect("/login");
	res.render("admin/product-add", {
		isAdmin: true,
		isLoggedIn: true,
	});
};

module.exports.getProductsupdate = async (req, res) => {
	if (req.isAuthenticated()) return res.redirect("/login");
	const { id } = req.params;
	let Product = await products.findById(id);
	res.render("admin/update-products", {
		Product,
        isAdmin: true,
        isLoggedIn: true
	});
};

module.exports.postProductUpdate = async (req, res, next) => {
	if (!req.isAuthenticated()) return res.redirect("/login");
	const { name, price, description, seller, imageUrl, id } = req.body;
	try {
		let Product = await products.findById(id);
		(Product.name = name),
			(Product.price = price),
			(Product.description = description),
			(Product.seller = seller),
			(Product.imageUrl = imageUrl);
		await Product.save();
		res.redirect("/admin/products/all");
	} catch (err) {
		console.log(err);
	}
};

module.exports.getProductDelete = async (req, res) => {
	const { id } = req.params;
	await products.deleteOne({ _id: id });
	res.redirect("/admin/products/all", {
        isAdmin: true,
        isLoggedIn: true
    });
};
