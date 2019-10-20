var express = require('express');
var videoRouter = express.Router();
var status = '';

var router = function (title) {

    var galleryController =
        require('../controllers/galleryController')(title);

    videoRouter.route('/')
        .get(galleryController.getGalleryVideos);

    return videoRouter;
};
module.exports = router;


