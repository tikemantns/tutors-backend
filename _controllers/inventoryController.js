var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var request = require('request');
var bcrypt = require('bcrypt-nodejs');

var Inventory = require("../_models/inventory");
var InventoryInstance = require("../_models/inventoryInstance");
var helpersMethods = require("../_helpers/helpersMethods");

/**
 * @Class Inventory Controller
 * 
 */

 class inventoryController {


    /*
    *   Publisher Functions
    */
    createInventory(req, res) {
        var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
        req.body.publisher_id = loggedInUser.group_id;
        req.body.creator_id = loggedInUser._id;
        var newInventory = new Inventory(req.body);

        newInventory.save(function(err) {
            if(err) {
                return res.json({ response: { success: false, msg: err }});
            } 

            res.json({ response: { success: true, msg: 'Inventory created successfully'}});
        })

    }

    addInventoryInstance(req, res) {
        var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
        req.body.created_by_id = loggedInUser._id;
        req.body.updated_on = new Date();
        req.body.pub_id = loggedInUser.group_id;
        var newInstance = new InventoryInstance(req.body);

        newInstance.save(function(err, doc) {
            if(err) {
                return res.json({ response: { success: false, msg: err }});
            } else {
                Inventory.findById(doc.inventory_id, 
                    (err, invDoc) => {
                        var invInstance = [];
                        invInstance = invDoc.inventory_instance;
                        invInstance.push({instance: doc._id});
                        // invDoc.inventory_instance = invInstance;
                        
                        var query = {
                            _id: invDoc._id
                        }

                        Inventory.findByIdAndUpdate(
                            query,
                            invDoc,
                            { new: true },
                            (err, doc) => {
                                if (err) return res.status(500).json({ response: { success: false, msg: err }});
                                return res.json({ response: { success: true, inventory: doc }});
                            }
                        )
                        
                    }
                )
                // return console.log(doc);
                // res.json({ success: true, msg: 'New Instance Added' });
            }
        })
    }

    getInventoryList(req, res) {

        var token = helpersMethods.getToken(req.headers);
        var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
        loggedInUser = loggedInUser.group_id;
        var pageNo = req.query.pageNo - 1;
        var pageStartIndex = pageNo * 10;
        var term = new RegExp(req.query.search, 'i');
        var sortKey = {};
        var obj = {};
        if (req.query.search) {
            obj = { "$text": { "$search": term } }, { "score": { "$meta": "textScore" } };
            sortKey = { "score": { "$meta": "textScore" } };
        }

        var catQuery = { 'publisher_id': loggedInUser };
        if(req.query.category != 0) {
            catQuery = { 'category': req.query.category, 'publisher_id': loggedInUser  };
        }

        if (token) {
            Inventory.find(obj, sortKey)
                    .find(catQuery)
                    .populate('creator_id')
                    .skip(pageStartIndex)
                    .sort(sortKey)
                    .limit(10)
                    .exec((err, doc) => {
                if (err) {
                    return res.json({ response: { success: false, response: err }});
                } else {

                    Inventory.count({}).exec((count_error, count) => {
                        if (err) {
                            return res.json({ response: { success: false, msg: count_error }});
                        } else {
                            res.json({ response: { success: true, total: count, pageNo: req.query.pageNo, pageStartIndex: pageStartIndex, inventory: doc }});
                        }

                    });
                }

            });
        } else {
            return res.status(403).send({ success: false, msg: 'Unauthorized.' });
        }
    }

    updateInventory(req, res) {
        var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));

        var query = {
            _id: req.query.id,
            publisher_id: loggedInUser.group_id
        }

        req.body.updated_by = loggedInUser._id;
        req.body.updated_on = new Date();

        Inventory.findOneAndUpdate(
            query,
            req.body,
            { new: true },
            (err, doc) => {
                if (err) return res.status(500).json({ response: { success: false, response: err }});
                return res.json({ response: { success: true,  inventory: doc }});
            }
        )
    }

    updateInventoryInstance(req, res) {
        var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));

        var query = {
            _id: req.query.id
        }

        req.body.updated_by = loggedInUser._id; 
        req.body.updated_on = new Date();

        InventoryInstance.findOneAndUpdate(
            query,
            req.body,
            { new: true },
            (err, doc) => {
                if (err) return res.status(500).json({ response: { success: false, response: err }});
                return res.json({ response: { success: true, inventory: doc }});
            }
        )
    }

    deleteInventory(req, res) {

        var invId = { _id: req.query.inventory_id };
        this.findInventoryInstance(req, res);

        Inventory.deleteOne( invId, (err) =>  {
            if (err) {
                return res.json({ response: { success: false, response: err}});
            }

            res.json({ response: { success: true, response: "Inventory deleted successfully"}});
        });

    }

     deleteInventoryInstance(req, res) {

         var instanceId = { _id: req.query.id };

         InventoryInstance.findById(req.query.id, (err, doc) => {
             if(err) res.json({ response: { success: false, msg: err }})
             else {
                 InventoryInstance.deleteOne(instanceId, (err) => {
                     if (err) {
                         return res.json({ response: { success: false, response: err } });
                     } else {
                         Inventory.update({ _id: doc.inventory_id }, 
                             { $pull: { inventory_instance: { instance: req.query.id } }},
                             (err, doc) => {
                                 if(err) res.json({response: { success: false, msg: err }})
                                 else {
                                     console.log("deleted");
                                 }
                             }
                            )
                     }

                     res.json({ response: { success: true, response: "Inventory instance deleted successfully" } });
                 });
             }
         })

         

     }

     findInventoryInstance(req, res) {

         InventoryInstance.find(
             { inventory_id: req.query.inventory_id },
             (err, docs) => {
                 if (err) {
                     return res.json({ response: { success: false, response: err }});
                 } else {
                     //  return console.log(docs);
                     docs.forEach((element, index) => {
                         // console.log(element._id);
                         var instanceId = { _id: element._id };
                         InventoryInstance.deleteOne(instanceId, (err) => {
                             if (err) {
                                 return res.json({ response: { success: false, response: err }});
                             }

                             return;
                         })
                     })
                 }
             }
         )
     }

     getInventoryDetails(req, res) {

         Inventory.find({ _id: req.query.inventory_id })
             .populate('inventory_instance.instance')
             .populate('creator_id')
            .exec((err, doc) => {
                if(err) {
                    res.json({ response: { success: false, response: err }});
                } else {
                    res.json({ response: { success: true, inventory: doc }});
                }
            })

     }

     addComments(req, res) {

         var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));

         var query = {
             _id: req.query.inventory_id
         }

         var commentObj = {
             message: req.body.message,
             sender_id: loggedInUser._id,
             send_on: new Date()
         }

        InventoryInstance.findByIdAndUpdate(
            query,
            { $push: { comment: commentObj } },
            { new: true },
            (err, doc) => {
                if(err) {
                    res.json({ response: { success: false, response: err }});
                } else {
                    res.json({ response: { success: true, response: "Comment Added", update: doc }});
                }
            }
        )

     }


     /*
     *  Advertiser functions
     */
    getInventoryInstanceList(req, res) {
        var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));

        var pageNo = req.query.pageNo - 1;
        var pageStartIndex = pageNo * 10;

        var term = new RegExp(req.query.search, 'i');
        var sortKey = {};
        var obj = {};
        if (req.query.search) {
            obj = { "$text": { "$search": term } }, { "score": { "$meta": "textScore" } };
            sortKey = { "score": { "$meta": "textScore" } };
        }

        var status = req.query.status.split(',');
        if(status[0] == 3) {
            obj.purchased_ad_groupid = loggedInUser.group_id;
        }
        
        // if(req.query.budget == 0) {
        //     req.query.budget = 1000000000000;
        // }

        InventoryInstance.find(obj, sortKey)
            .where('max_usage').gte(1)
            .where('book_before_date').gte(new Date())
            .where('status').in(status)
            .populate('inventory_id')
            // .populate({
            //     path: 'inventory_id',
            //     match: { price: { $gte: 0, $lte: req.query.budget } },
            // })
            .populate('created_by_id')
            .populate('campaign_id')
            .limit(10)
            .skip(pageStartIndex)
            .exec((err, doc) => {
                if (err) res.json({ response: { success: false, response: err }});
                else {

                    InventoryInstance.count()
                        .where('max_usage').gte(1)
                        .where('book_before_date').gte(new Date())
                        .exec((err, count) => {
                            // res.json({ success: true, total: count, pageNo: req.query.pageNo, perPage: 10, response: doc });

                            if(doc.length == 0) {
                                InventoryInstance.find()
                                    .where('max_usage').gte(1)
                                    .where('book_before_date').gte(new Date())
                                    .where('status').in(status)
                                    .populate('inventory_id')
                                    // .populate({
                                    //     path: 'inventory_id',
                                    //     match: { price: { $gte: 0, $lte: req.query.budget }, "$text": { "$search": term } },
                                    // })
                                    .limit(10)
                                    .skip(pageStartIndex)
                                    .exec((err, doc) => {
                                        if (err) res.json({ response: { success: false, response: err }});
                                        else {
                                            res.json({ response: { success: true, total: count, pageNo: req.query.pageNo, perPage: 10, inventory: doc }});
                                        }
                                    })
                            } else {
                                res.json({ response: { success: true, total: count, pageNo: req.query.pageNo, perPage: 10, inventory: doc } });
                            }
                        })
                }
            })

    }

    getInstanceDetails(req, res) {
        InventoryInstance.find({ _id: req.query.instance_id})
            .populate({
                path: 'inventory_id',
                populate: { path: 'comment.sender_id' }
            })
            .populate('created_by_id')
            .populate('ad_content_id')
            .populate({
                path: 'ad_content_id',
                populate: { path: 'add_url.url_added_by'},
                populate: { path: 'attached_files.file_uploaded_by' }
            })
            .exec((err, doc) => {
                if (err) res.json({ response: { success: false, response: err } });
                else {
                    res.json({ response: { success: true, response: doc } });
                }
            })
    }

    getInstanceList(req, res) {

        var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));        
        var pageNo = req.query.pageNo - 1;
        var pageStartIndex = pageNo * 10;

        var term = new RegExp(req.query.search, 'i');
        var sortKey = {};
        var obj = {};
        if (req.query.search) {
            obj = { "$text": { "$search": term } }, { "score": { "$meta": "textScore" } };
            sortKey = { "score": { "$meta": "textScore" } };
        }


        var statusArr = req.query.status.split(',');

        var group = loggedInUser.group_id.includes('pub');
        if(group) {

            var dateQuery = dateQuery = { $gte: 0 };
            var pubId = loggedInUser.group_id;

            Inventory.find(obj, sortKey)
                .where('status').equals(1)
                .populate({
                    path: 'inventory_instance.instance',
                    populate: [{
                        path: 'ad_content_id',
                        populate: [{ path: 'attached_files.file_uploaded_by' }, { path: 'add_url.url_added_by' }]
                    }, {
                        path: 'comment.sender_id'
                    }, {
                        path: 'purchased_by'
                    }],
                    match: { status: { $in: statusArr }, pub_id: { $eq: pubId }, start_date: dateQuery }
                })
                .limit(10)
                .skip(pageStartIndex)
                .exec((err, inv) => {
                    if (err) res.json({ success: false, msg: err })
                    else {
                        res.json({ response: { success: true, total: inv.length, pageNo: req.query.pageNo, perPage: 10, inventory: inv } });
                    }
                })

        } else {
            var dateQuery = null;
            var purchasedQuery = null;
            if (statusArr[0] == 3) {
                purchasedQuery = loggedInUser.group_id;
                dateQuery = { $gte: 0 };
            } else {
                dateQuery = { $gte: new Date() };
            }

            Inventory.find(obj, sortKey)
                .where('status').equals(1)
                .populate({
                    path: 'inventory_instance.instance',
                    populate: [{ path: 'ad_content_id', 
                        populate: [{ path: 'attached_files.file_uploaded_by' }, { path: 'add_url.url_added_by' }] 
                    }, {
                        path: 'comment.sender_id'
                    }],
                    match: { status: { $in: statusArr }, purchased_ad_groupid: { $eq: purchasedQuery }, start_date: dateQuery }
                })
                .limit(10)
                .skip(pageStartIndex)
                .exec((err, inv) => {
                    if (err) res.json({ success: false, msg: err })
                    else {
                        res.json({ response: { success: true, total: inv.length, pageNo: req.query.pageNo, perPage: 10, inventory: inv } });
                    }
                })
        }

        
    }

 }

 module.exports = inventoryController;