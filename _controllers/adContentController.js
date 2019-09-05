var passport = require('passport');
require('../config/passport')(passport);
var mongoose = require('mongoose');
const aws = require('aws-sdk');
const config = require('../config/env');

var AdContent = require('../_models/adContent');
var Campaign = require('../_models/campaign');
var helpersMethods = require('../_helpers/helpersMethods');
var InventoryInstance = require("../_models/inventoryInstance");


class adContentController {

    createAdContent(req, res) {
        var loggedInUser = helpersMethods.getLoggedInUser(helpersMethods.getToken(req.headers));
        
        var pushObj = {};
        if(req.body.attached_files != undefined) {
            req.body.attached_files.forEach((element) => {
                element.file_uploaded_by = loggedInUser._id,
                element.file_uploaded_on = new Date()
            })

            pushObj = { $push: { attached_files: req.body.attached_files } };
        } 

        if(req.body.add_url != undefined) {
            req.body.add_url.forEach((element) => {
                element.url_added_by = loggedInUser._id,
                element.url_added_on = new Date()
            })

            pushObj = { $push: { add_url: req.body.add_url } };
        }

        if (req.body.add_url != undefined && req.body.attached_files != undefined) {
            pushObj = { $push: { attached_files: req.body.attached_files, add_url: req.body.add_url } };
        }

        req.body.inventory_instance_id = req.query.instance_id;
        req.body.ad_created_by = loggedInUser.group_id;

        AdContent.find({ inventory_instance_id: req.query.instance_id, campaign_id: req.body.campaign_id }, 
            (err, doc) => {
                if (err) {
                    res.json({ success: false, response: err });
                } else {
                    if (doc.length == 0) {
                        req.body.ad_created_by = loggedInUser._id;
                        var newContent = new AdContent(req.body);
                        newContent.save((function (err, saved) {
                            if (err) {
                                return res.json({ success: false, msg: err });
                            }

                            res.json({ success: true, msg: 'Content added successfully' });

                            console.log(saved._id);
                            InventoryInstance.findOneAndUpdate(
                                { _id: req.query.instance_id }, 
                                { $push: { ad_content_id: saved._id} }, 
                                { new: true },
                                (err, data) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        data.updated_on = new Date();
                                        // data.updated_by = loggedInUser._id;
                                        data.status = req.body.status;
                                        console.log(data);
                                        data.save();
                                    }
                                }
                            )

                        }))
                    } else {
                        var query = { _id: doc[0]._id };
                        var adId = doc[0]._id;
                        console.log(adId);

                            AdContent.findByIdAndUpdate(
                                query,
                                pushObj,
                                (err, doc) => {
                                    if (err) {
                                        res.json({ success: false, response: err });
                                    } else {
                                        res.json({ success: true, response: doc });

                                        console.log({ $push: { ad_content_id: adId } });
                                        // InventoryInstance.findByIdAndUpdate(
                                        //     { _id: req.query.instance_id },
                                        //     { $push: { ad_content_id: adId } },                                            
                                        //     (err, doc) => {
                                        //         if (err) {
                                        //             console.log(err);
                                        //         } else {
                                        //             doc.updated_on = new Date();
                                        //             // doc.updated_by = loggedInUser._id;   
                                        //             doc.status = req.body.status;                                         
                                        //             // // console.log(doc);
                                        //             doc.save();
                                        //             // res.json({ success: true, response: doc });
                                        //         }
                                        //     }
                                        // )
                                    }
                                }
                            )

                    }
                }
            })
    }

    getAdContent(req, res) {

        AdContent.find({
            campaign_id: req.query.campaign_id,
            inventory_instance_id: req.query.instance_id
        }).exec((err, doc) => {
            if(err) {
                res.json({ success: false, response: err });
            } else {
                res.json({ success: true, response: doc });
            }
        })

    }

    deleteAttachment(req, res) {

        var query = {
            campaign_id: req.query.campaign_id,
            inventory_instance_id: req.query.instance_id
        }

        var removeQuery = {};
        //type 1 = removing attached file
        if(req.query.type == 1) {
            // removeQuery = { $pull: { "attached_files": { _id: req.query.attachment_id } } }
            removeQuery = { $pull: { "attached_files": { url: req.query.file_url.replace(/ /g, '%20') } } }

            var temp = req.query.file_url.split('/');
            var awsFileKey = temp[3] + '/' + temp[4] + '/' + temp[5];

            var bucketInstance = new aws.S3();
            var params = {
                Bucket: config.AWS_BUCKET,
                Key: awsFileKey
            };

            bucketInstance.deleteObject(params, function (err, data) {
                if (data) {
                    // console.log("File deleted successfully");
                    AdContent.findOneAndUpdate(
                        query,
                        removeQuery,
                        { safe: true, upsert: true },
                        (err, doc) => {
                            if (err) {
                                res.json({ success: false, response: err });
                            } else {
                                res.json({ success: true, response: doc });
                            }
                        }
                    )

                }
                else {
                    // console.log("Check if you have sufficient permissions : " + err);
                    res.json({ success: false, response: err });
                }
            });


        } else {
            removeQuery = { $pull: { "add_url": { url_link: req.query.link_url } } }

            AdContent.findOneAndUpdate(
                query,
                removeQuery,
                { safe: true, upsert: true },
                (err, doc) => {
                    if (err) {
                        res.json({ success: false, response: err });
                    } else {
                        res.json({ success: true, response: doc });
                    }
                }
            )
        }

        // AdContent.findOneAndUpdate(
        //     query,
        //     removeQuery,
        //     { safe: true, upsert: true },
        //     (err, doc) => {
        //         if(err) {
        //             res.json({ success: false, response: err });
        //         } else {
        //             res.json({ success: true, response: doc });
        //         }
        //     }
        // )
    }

    deleteCampaignAttachment(req, res) {
        
        // console.log(awsFileKey);

        if(req.query.type == 1) {
            var temp = req.query.file_url.split('/');
            var awsFileKey = temp[3] + '/' + temp[4] + '/' + temp[5];

            var removeQuery = { $pull: { "attached_file": { url: req.query.file_url } } };

            var bucketInstance = new aws.S3();
            var params = {
                Bucket: config.AWS_BUCKET,
                Key: awsFileKey
            };

            bucketInstance.deleteObject(params, function (err, data) {
                if (data) {
                    // console.log("File deleted successfully");
                    Campaign.findOneAndUpdate(
                        { _id: req.query.campaign_id },
                        removeQuery,
                        (err, doc) => {
                            if (err) res.json({ success: false, response: err });
                            else {
                                res.json({ success: true, response: "File deleted successfully" });
                            }
                        }
                    )
                }
                else {
                    // console.log("Check if you have sufficient permissions : " + err);
                    res.json({success: false, response: err});
                }
            });
        } else {
            // console.log("removing url");
            // var removeQuery = { $pull: { "added_url": { $in: [ { url_link: req.query.link_url } ] } } };
            var removeQuery = { $pull: { "added_url": { url_link: req.query.link_url } } };

            Campaign.findOneAndUpdate(
                { _id: req.query.campaign_id },
                removeQuery,
                (err, doc) => {
                    if (err) res.json({ success: false, response: err });
                    else {
                        res.json({ success: true, response: "Link removed successfully" });
                    }
                }
            )
        }

    }

}

module.exports = adContentController;