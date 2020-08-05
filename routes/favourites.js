const express = require('express');
const bodyParser = require('body-parser');

const Favourites = require('../models/favourite');

const favouritesRouter = express.Router();
favouritesRouter.use(bodyParser.json());

favouritesRouter.route('/')
    .get(async (req, res) => {

       try {
           const favs = await Favourites.find({}).populate('user').populate('channels');
           if(!favs) return res.status(404).send('Not Found');

           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           res.json(favs);
       } catch (err){
           res.status(400).send(err);
       }
    })
    .post( (req, res, next) => {
        Favourites.findOne({"user": req.user._id})
            .then((favorite) => {
                if (favorite) {
                    for (let i = 0; i < req.body.length; i++) {
                        if (favorite.channels.indexOf(req.body[i]._id) === -1) {
                            favorite.channels.push(req.body[i]._id);
                        }
                    }
                    favorite.save()
                        .then((favorite) => {
                            Favourites.findById(favorite._id)
                                .populate('user')
                                .populate('channels')
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                        })
                        .catch((err) => {
                            return next(err);
                        });
                } else {
                    Favourites.create({"user": req.user._id, "channels": req.body})
                        .then((favorite) => {
                            Favourites.findById(favorite._id)
                                .populate('user')
                                .populate('channels')
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                        })
                        .catch((err) => {
                            return next(err);
                        });
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(async (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favourites');

    })
    .delete( (req, res, next) => {
        Favourites.findOneAndRemove({"user": req.user._id})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));

    });

favouritesRouter().route('/:channelId')
    .get((req,res,next) => {
        Favourites.findOne({user: req.user._id})
            .then((favorites) => {
                if (!favorites) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": false, "favorites": favorites});
                }
                else {
                    if (favorites.channels.indexOf(req.params.channelId) < 0) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({"exists": false, "favorites": favorites});
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({"exists": true, "favorites": favorites});
                    }
                }

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post((req, res, next) => {
        Favourites.findOne({user: req.user._id})
            .then((favorite) => {
                if (favorite) {
                    if (favorite.channels.indexOf(req.params.channelId) === -1) {
                        favorite.channels.push(req.params.channelId)
                        favorite.save()
                            .then((favorite) => {
                                Favourites.findById(favorite._id)
                                    .populate('user')
                                    .populate('channels')
                                    .then((favorite) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favorite);
                                    })
                            })
                            .catch((err) => {
                                return next(err);
                            });
                    }
                }
                else {
                    Favourites.create({"user": req.user._id, "channels": [req.params.channelId]})
                        .then((favorite) => {
                            Favourites.findById(favorite._id)
                                .populate('user')
                                .populate('channels')
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                        })
                        .catch((err) => {
                            return next(err);
                        });
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put( (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favourites/'+ req.params.channelId);
    })
    .delete((req, res, next) => {
        Favourites.findOne({user: req.user._id})
            .then((favorite) => {
                if (favorite) {
                    index = favorite.channels.indexOf(req.params.channelId);
                    if (index >= 0) {
                        favorite.channels.splice(index, 1);
                        favorite.save()
                            .then((favorite) => {
                                Favourites.findById(favorite._id)
                                    .populate('user')
                                    .populate('channels')
                                    .then((favorite) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favorite);
                                    })
                            })
                            .catch((err) => {
                                return next(err);
                            });
                    }
                    else {
                        err = new Error('Channel ' + req.params.channelId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }
                else {
                    err = new Error('Favourites not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = favouritesRouter;