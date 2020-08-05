const express = require('express');
const bodyParser = require('body-parser');
const Categories = require('../models/category');

const categoriesRouter = express.Router();
categoriesRouter.use(bodyParser.json());

categoriesRouter.route('/')
    .get(async (req, res) => {
        try {
            const categories = await Categories.find({});
            if(!categories) return res.status(404).send('Not Found');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(categories);
        } catch (err){
            res.status(400).send(res.json(err));
        }

    })
    .post(async (req, res) => {
        const category = new Categories({
            name: req.body.name,
            description: req.body.description,
            image: req.body.image
        });
        try {
            const savedCategory = await category.save();
            res.send(savedCategory);
        } catch (err){
            res.status(400).send(err);
        }
    })
    .put(async (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /categories');

    })
    .delete(async  (req, res) => {
        try {
            const resp = await Categories.deleteMany({});
            res.status(200).send('All Categories have been deleted!');
        } catch (err){
            res.status(400).send(err);
        }

    });

categoriesRouter.route('/:categoryId')
    .get(async (req, res) => {
        try {
            const foundCategory= await Categories.findById(req.params.categoryId);
            if (!foundCategory) return res.status(404).send('Not Found');

            res.status(200).send(res.json(foundCategory));
        } catch (err){
            res.status(400).send(err);
        }

    })
    .post(async (req, res) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /categories/' + req.params.categoryId);

    })
    .put(async (req, res) => {
        try {
            const updatedCategory = await Categories.findByIdAndUpdate(req.params.categoryId, {$set: req.body}, { new: true });
            if(!updatedCategory) return res.status(404).send('Not Found');
            res.status(200).send(res.json(updatedCategory));
        } catch (err){
            res.status(400).send(err);
        }

    })
    .delete(async (req, res) => {
        try {
            const deletedCategory = await Categories.findByIdAndRemove(req.params.categoryId);
            if(!deletedCategory) return res.status(404).send('Not Found');
            res.status(200).send(res.json(deletedCategory));
        } catch (err){
            res.status(400).send(err);
        }

    });




module.exports = categoriesRouter;
