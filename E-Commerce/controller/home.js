const Products = require('../model/products')
const {getPtoductCategoryWise} = require('../utils/library')
const User = require('../model/user')
const { isLoggedIn } = require('../middlewares/isLoggedIn')
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.getHome = async (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect('/login')
    try {
        let Product = await Products.find()
        Product = getPtoductCategoryWise(Product);
        res.render('index', {
            Product: Product,
            isAdmin: (req.user.role == 'admin') ? true: false,
            isLoggedIn: true
        })
    } catch(err) {
        next(err)
    }
}

module.exports.getLogin = (req, res) => {
    if(req.isAuthenticated()) return res.redirect('/');
    res.render('login')
}

module.exports.getSignup = (req, res) => {
    if(req.isAuthenticated())return res.redirect('/');
    res.render('signup')
}

module.exports.postSignup = async (req, res, next) => {
	let { username, password } = req.body;
	try {
		let user = await User.findOne({ username });

		if (user)
			return res.render("signup", {
				msg: "This user already exist try another",
			});

		bcrypt.hash(password, saltRounds, async function (err, hash) {
			user = await User.create({
				username,
				password: hash
			});
		});

		res.redirect("/login");
	} catch (err) {
		next(err)
	}
};

