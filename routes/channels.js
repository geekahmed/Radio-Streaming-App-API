const express = require('express');
const bodyParser = require('body-parser');
const Channels = require('../models/channel');
const channelRouter = express.Router();
channelRouter.use(bodyParser.json());

channelRouter.route('/')
    .get(async (req, res) => {
        try {
            const channels = await Channels.find({}).populate('category');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(channels);
        } catch (err){
            res.status(404).send('No Channels');
        }
    })
    .post(async (req, res) => {
            const channel = new Channels({
               name: req.body.name,
               description: req.body.description,
               image: req.body.image,
               status: req.body.status,
               link: req.body.link,
               category: req.body.category
            });
        try{
            const savedChannel = await channel.save();
            const nc = await Channels.findOne({_id: savedChannel._id}).populate('category');
            res.send(nc);
        } catch (err){
            res.status(400).send(err);
        }
    })
    .put(async (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /channels');

    })
    .delete(async (req, res) => {
        try {
            const resp = await Channels.deleteMany({});
            res.status(200).send('All Channels have been deleted!');
        } catch (err){
            res.status(400).send(err);
        }

    });

channelRouter.route('/:channelId')
    .get(async (req, res) => {
        try {
            const foundChannel = await Channels.findById(req.params.channelId);
            if (!foundChannel) return res.status(404).send('Not Found');

            res.status(200).send(res.json(foundChannel));
        } catch (err){
            res.status(400).send(err);
        }

    })
    .post( (req, res) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /channels/' + req.params.channelId);
    })
    .put(async (req, res) => {
        try {
            const updatedChannel = await Channels.findByIdAndUpdate(req.params.channelId, {$set: req.body}, { new: true });
            if(!updatedChannel) return res.status(404).send('Not Found');
            res.status(200).send(res.json(updatedChannel));
        } catch (err){
            res.status(400).send(err);
        }

    })
    .delete(async (req, res) => {
        try {
            const deletedChannel = await Channels.findByIdAndRemove(req.params.channelId);
            if(!deletedChannel) return res.status(404).send('Not Found');
            res.status(200).send(res.json(deletedChannel));
        } catch (err){
            res.status(400).send(err);
        }
    });


module.exports = channelRouter;