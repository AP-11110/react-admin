import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import getCountryIso3 from "country-iso-2-to-3";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        const productsWithStats = await Promise.all(
            products.map(async (product) => {
                const stat = await ProductStat.find({
                    productId: product._id
                })
                return {
                    ...product._doc, // _doc when dealing with promises
                    stat,
                }
            })
        );

        res.status(200).json(productsWithStats);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: "user" }).select("-password");
        res.status(200).json(customers);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getTransactions = async (req, res) => {
    try {

        // sort coming from MUI: { "field", "userId", "sort", "desc" }
        const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

        // formatted sort should look like { userId: -1 }
        const generateSort = () => {
            const sortParsed = JSON.parse(sort);
            console.log(sortParsed)
            const sortFormatted = {
                [sortParsed.field]: sortParsed.sort = "asc" ? 1 : -1
            }
            console.log(sortParsed, sortFormatted)

            return sortFormatted;
        }
        const sortFormatted = Boolean(sort) ? generateSort() : {};

        const transactions = await Transaction.find({
            $or: [
                { cost: { $regex: new RegExp(search, "i") }},
                { userId: { $regex: new RegExp(search, "i") }},
            ]
        }).sort(sortFormatted)
          .skip(page * pageSize)
          .limit(pageSize);

        const total = await Transaction.countDocuments({
            name: { $regex: search, $options: "i" }
        });
    

        res.status(200).json({
            transactions,
            total
        });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getGeography = async (req, res) => {
    try {
        const users = await User.find();

        // getting users count for each country & converting country names from 2 to 3 letters.
        const mappedLocations = users.reduce((prev, { country }) => {
            const countryISO3 = getCountryIso3(country);
            prev[countryISO3] = prev[countryISO3] + 1 || 1;
            return prev; 
        }, {});

        const formattedLocations = Object.entries(mappedLocations).map(
            ([country, count]) => {
                return { id: country, value: count }
            }
        );
        res.status(200).json(formattedLocations);
    } catch (err) {
        res.status(404).json({ message: error.message });
    }
}