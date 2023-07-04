const Contact = require('../models/Contact');
const sendSms = require("../utils/sms");


const createContact = async(req, res) => {
    const {email, title, message} = req.body;

    if(!email || !title || !message) return res.status(400).json({message: "all fields are required"});

    const contactObject = {email, title, message};

    const contact = await Contact.create(contactObject);

    if(contact) {
      sendSms.sendAnSms("254768702540", "You have a new message." )

        return res.status(201).json({message: "Your query has been sent"});
    }
    else{
        return res.status(500).json({message: "invalid data"});
    }
}

const getAllContacts = async(req, res) => {
    const page = req?.query?.page || 1;
    const perPage = req?.query?.perPage || 20;
  
  
    const [contacts, count] = await Promise.all([
      Contact.find()
        .skip((page - 1) * parseInt(perPage))
        .limit(parseInt(perPage))
        .lean()
        .exec(),
  
      Contact.countDocuments(),
    ]);
  
    if (!contacts?.length) {
      return res.status(200).json({ message: "No contact found" });
    }
    res.json({ contacts, count });
}

module.exports = {
    createContact,
    getAllContacts
}