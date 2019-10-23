// Copyright 2018 IBM Corp. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

var galleryController = function (title) {
    var config = {
        endpoint: "https://s3.us-east.cloud-object-storage.appdomain.cloud",
        apiKeyId: "Enter you api key here",
        serviceInstanceId: "Put your instance id",
    };


    var aws = require('ibm-cos-sdk');
    var multer = require('multer');
    var multerS3 = require('multer-s3');
    // var ep = new aws.Endpoint('https://s3.us-south.cloud-object-storage.appdomain.cloud');
    var s3 = new aws.S3(config);
    var myBucket = 'hackathon2019';

    var upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: myBucket,
            key: function (req, file, cb) {
                cb(null, file.originalname);
                console.log(file);
            }
        })
    });

    var getGalleryImages = function (req, res) {

        var imageUrlList = [];
        var params = { Bucket: myBucket };
        s3.listObjects(params, function (err, data) {
            if (data) {
                var bucketContents = data.Contents;
                // console.log(data);
                for (var i = 0; i < bucketContents.length; i++) {
                    if (bucketContents[i].Key.search(/.jpg/i) > -1) {
                        imageUrlList.push(generateUrl(bucketContents[i].Key));
                    }
                }
            }

            res.render('galleryView', {
                title: title,
                imageUrls: imageUrlList
            });
        });
    };


    var getGalleryVideos = function (req, res) {

        var videoUrlList = [];
        var params = { Bucket: myBucket };
        s3.listObjects(params, function (err, data) {
            if (data) {
                var bucketContents = data.Contents;
                // console.log(data);
                for (var i = 0; i < bucketContents.length; i++) {
                    if (bucketContents[i].Key.search(/.mp4/i) > -1) {
                        videoUrlList.push(generateUrl(bucketContents[i].Key));
                    }
                }
            }

            res.render('videoView', {
                title: title,
                videoUrls: videoUrlList
            });
        });
    };


    return {
            getGalleryVideos: getGalleryVideos,
        getGalleryImages: getGalleryImages,
        upload: upload
    };
};

generateUrl = (key) => {
    baseUrl = "https://s3.us-east.cloud-object-storage.appdomain.cloud/";
    bucketName = "Put your bucket name"

    return baseUrl + bucketName + key;

}

module.exports = galleryController;
