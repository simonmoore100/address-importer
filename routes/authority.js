var express = require('express');
var router = express.Router();
var fs = require('fs');
var csv = require('fast-csv');
var config = require('../config/settings');
var startsWith = require('starts-with');
var StringBuilder = require('string-builder');
var capitalize = require('string-case');


router.get('/', function(req, res, next) {

    csv.fromPath(config.inputAuthorityFilePath + config.inputAuthorityFileName,{headers: true})
        .on("data", function(data){

            var addressLine = new StringBuilder(),
                postcode = data.POSTCODE;

            if (postcode !== undefined && postcode !== ''){

                var normalisedPostcode = postcode.replace(/\s+/g, '').toLowerCase();

                addressLine.append("{");

                if (normalisedPostcode.length > 1){
                    addressLine.append("\"postcode\":\"" + normalisedPostcode.trim() + "\",");
                }

                addressLine.append("\"country\":\"" + config.niCountry + "\",");
                addressLine.append("\"gssCode\":\"" + config.niGssCode + "\",");
                addressLine.append("\"name\":\"" + config.niCountry + "\",");
                addressLine.append("\"easting\":1.1,");
                addressLine.append("\"northing\":0,");
                addressLine.append("\"lat\":1.1,");
                addressLine.append("\"long\":0,");
                addressLine.append("\"nhsHealthAuthority\":\"" + config.niGssCode + "\",");
                addressLine.append("\"ward\":\"" + config.niGssCode + "\"}\n");

                fs.appendFile(config.outputAuthorityFilePath + config.outputAuthorityFileName, addressLine.toString(), function (err) {
                    console.log("writing " + normalisedPostcode);
                    if (err){
                        console.log(err);
                    }
                });
            }
        })
        .on("end", function(){
            console.log("done");
        });

    res.render('authority');

});

module.exports = router;
