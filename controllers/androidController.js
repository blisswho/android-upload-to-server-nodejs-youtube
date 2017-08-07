var express = require('express');
var multer = require('multer');
var fs = require('fs');
var path = require('path');

module.exports = function(app) {

    var UPLOAD_PATH = "./uploads/";

    //PRINTING METHODS

    function printRequestHeaders(req) {
        console.log("\nReceived headers");
        console.log("----------------");

        for (var key in req.headers) {
            console.log(key + ": " + req.headers[key]);
        }

        console.log("");
    }

    function printRequestParameters(req) {
        console.log("\nReceived Parameters");
        console.log("-------------------");

        for (var key in req.body) {
            console.log(key + ": " + req.body[key]);
        }

        if (Object.keys(req.body).length === 0)
            console.log("no text parameters\n");
        else
            console.log("");
    }

    var multipartReqInterceptor = function(req, res, next) {
        console.log("\n\nHTTP/Multipart Upload Request from: " + req.ip);
        printRequestHeaders(req);
        next();
    };

    var fileUploadCompleted = false;

    var multerFiles = multer({
        dest: UPLOAD_PATH,
        rename: function (fieldname, filename) {
            return filename;
        },

        onParseEnd: function(req, next) {
            printRequestParameters(req);

            next();
        },

        onFileUploadStart: function (file) {
            console.log("Started file upload\n  parameter name: " +
                        file.fieldname + "\n  file name: " +
                        file.originalname + "\n  mime type: " + file.mimetype);
        },

        onFileUploadComplete: function (file) {
            var fullPath = path.resolve(UPLOAD_PATH, file.originalname);
            console.log("Completed file upload\n  parameter name: " +
                        file.fieldname + "\n  file name: " +
                        file.originalname + "\n  mime type: " + file.mimetype +
                        "\n  in: " + fullPath);
            fileUploadCompleted = true;
        }
    });

    var multipartUploadHandler = function(req, res) {
        if (fileUploadCompleted) {
            fileUploadCompleted = false;
            res.header('transfer-encoding', ''); // disable chunked transfer encoding
            res.end("Upload Ok!");
        }
    };

    //Requires Multer Version 0.1.8
    //Learn how to update in future
    app.post('/upload/multipart', multipartReqInterceptor, multerFiles, multipartUploadHandler);

}
