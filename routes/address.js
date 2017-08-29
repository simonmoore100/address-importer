var express = require('express');
var router = express.Router();
var fs = require('fs');
var csv = require('fast-csv');
var config = require('../config/settings');
var startsWith = require('starts-with');
var StringBuilder = require('string-builder');
var capitalize = require('string-case');


router.get('/', function(req, res, next) {

    csv.fromPath(config.inputAddressFilePath + config.inputAddressFileName,{headers: true})
        .on("data", function(data){

            var addressLine = new StringBuilder(),
                sub_building_name = data.SUB_BUILDING_NAME,
                building_name = data.BUILDING_NAME,
                building_number = data.BUILDING_NUMBER,
                primary_thorfare = data.PRIMARY_THORFARE,
                locality = data.LOCALITY,
                town = data.TOWN,
                county = data.COUNTY,
                postcode = data.POSTCODE,
                uprn = data.UPRN,
                classification = data.CLASSIFICATION,
                usrn = data.USRN,
                helper1 = data.HELPER_1,
                helper2 = data.HELPER_2;

            if (startsWith(classification,config.residentialClassificationCode) && postcode !== undefined && postcode !== ''){

                var property = sub_building_name + ' ' + building_name,
                    street = building_number + ' ' + primary_thorfare,
                    normalisedPostcode = postcode.replace(/\s+/g, '').toLowerCase();

                addressLine.append("{");

                if (normalisedPostcode.length > 1){
                    addressLine.append("\"postcode\":\"" + normalisedPostcode.trim() + "\",");
                }

                addressLine.append("\"gssCode\":\"" + config.niGssCode + "\",");
                addressLine.append("\"country\":\"" + config.niCountry + "\",");

                if (uprn.length > 1){
                    addressLine.append("\"uprn\":\"" + uprn.trim() + "\",");
                }

                addressLine.append("\"createdAt\":ISODate(),");
                addressLine.append("\"presentation\":{");

                if (property.length > 1){
                    addressLine.append("\"property\":\"" + capitalize.initCapAndLowerCaseAllTheOthers(property.trim()) + "\",");
                }

                if (street.length > 1){
                    if (!street.includes("Jan-") && !street.includes("Feb-") && !street.includes("Mar-") && !street.includes("Apr-") 
                        && !street.includes("May-") && !street.includes("Jun-") && !street.includes("Jul-") && !street.includes("Aug-") 
                        && !street.includes("Sep-") && !street.includes("Oct-") && !street.includes("Nov-") && !street.includes("Dec-") 
                        && !street.includes("-Jan") && !street.includes("-Feb") && !street.includes("-Mar") && !street.includes("-Apr") 
                        && !street.includes("-May") && !street.includes("-Jun") && !street.includes("-Jul") && !street.includes("-Aug") 
                        && !street.includes("-Sep") && !street.includes("-Oct") && !street.includes("-Nov") && !street.includes("-Dec")){
                    
                    addressLine.append("\"street\":\"" + capitalize.initCapAndLowerCaseAllTheOthers(street.trim()) + "\",");
                    
                    }
                }

                if (locality.length > 1){
                    addressLine.append("\"locality\":\"" + capitalize.initCapAndLowerCaseAllTheOthers(locality.trim()) + "\",");
                }

                if (town.length > 1){
                    addressLine.append("\"town\":\"" + capitalize.initCapAndLowerCaseAllTheOthers(town.trim()) + "\",");
                }

                if (county.length > 1){
                    addressLine.append("\"area\":\"County " + capitalize.initCapAndLowerCaseAllTheOthers(county.trim()) + "\",");
                }

                if (postcode.length > 1){
                    addressLine.append("\"postcode\":\"" + postcode.trim() + "\"},");
                }

                addressLine.append("\"location\":{\"lat\":1.1,\"long\":0},");
                addressLine.append("\"details\":{\"blpuCreatedAt\":ISODate(),");
                addressLine.append("\"blpuUpdatedAt\":ISODate(),");
                addressLine.append("\"classification\":\"RD\",");
                addressLine.append("\"status\":\"inUse\",");
                addressLine.append("\"state\":\"approved\",");
                addressLine.append("\"isPostalAddress\":true,");
                addressLine.append("\"isCommercial\":false,");
                addressLine.append("\"isResidential\":true,");
                addressLine.append("\"isHigherEducational\":true,");
                addressLine.append("\"isElectoral\":true,");

                if (usrn.length > 1){
                    addressLine.append("\"usrn\":\"" + usrn + "\",");
                }

                addressLine.append("\"file\":\"" + config.inputAddressFileName + "\",");
                addressLine.append("\"primaryClassification\":\"Residential\",");
                addressLine.append("\"secondaryClassification\":\"Dwelling\"},");
                addressLine.append("\"ordering\":{");

                if (!helper1.includes("Jan-") && !helper1.includes("Feb-") && !helper1.includes("Mar-") && !helper1.includes("Apr-") 
                    && !helper1.includes("May-") && !helper1.includes("Jun-") && !helper1.includes("Jul-") && !helper1.includes("Aug-") 
                    && !helper1.includes("Sep-") && !helper1.includes("Oct-") && !helper1.includes("Nov-") && !helper1.includes("Dec-") 
                    && !helper1.includes("-Jan") && !helper1.includes("-Feb") && !helper1.includes("-Mar") && !helper1.includes("-Apr") 
                    && !helper1.includes("-May") && !helper1.includes("-Jun") && !helper1.includes("-Jul") && !helper1.includes("-Aug") 
                    && !helper1.includes("-Sep") && !helper1.includes("-Oct") && !helper1.includes("-Nov") && !helper1.includes("-Dec")){
                    
                    addressLine.append("\"paoStartNumber\":" + helper1 + ",");
                }

                if (helper2 > 0){
                    addressLine.append("\"saoText\":" + helper2 + ",");
                }

                addressLine.append("\"street\":\"" + primary_thorfare + "\"}}\n");

                fs.appendFile(config.outputAddressFilePath + config.outputAddressFileName, addressLine.toString(), function (err) {
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

    res.render('address');

});

module.exports = router;
