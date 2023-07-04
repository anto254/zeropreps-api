var unirest = require("unirest");


const url = "https://bulksms.afrinettelecom.co.ke/api/services/sendsms/"
const apikey = process.env.API_KEY;
const partnerID = process.env.PARTNER_ID;
const shortcode = process.env.SHORT_CODE;

const sendAnSms = async (phoneNumbers, message) => {
    
    
        const bodyObject = {apikey, partnerID, message, shortcode, "mobile": phoneNumbers.toString()};
    
       unirest
        .post(url)
        .headers({'Accept':'application/json','Content-Type':'application/json'})
        .send(bodyObject)
        .then(() => {
        });


}



module.exports = {
    sendAnSms
}