module.exports.getPtoductCategoryWise = function (Product) {
    let data = {}

    Product.forEach(product => {
        let arr = data[product.category] || []
        arr.push(product)
        data[product.category] = arr
    });

    return data;
}