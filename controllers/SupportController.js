const Support = require("../models/Support");

const sendUsMessage = async (req, res) => {
  const { email, topic, message } = req.body;

  if (!email || !topic || !message)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const supportObject = { email, topic, message };

    const support = await Support.create(supportObject);

    if (support) {
      res.status(201).json({ message: `Message sent` });
    } else {
      res.status(400).json({ message: "Invalid message data received" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getSupportMessages = async (req, res) => {
  const page = req?.query?.page || 1;
  const perPage = req?.query?.perPage || 20;
  const skip = (page - 1) * parseInt(perPage);

  const count = await Support.countDocuments();

  const messages = await Support.find()
    .limit(parseInt(perPage))
    .skip(skip)
    .lean()
    .exec();

    if (!messages?.length) {
        return res.status(200).json({ message: "No support messages" });
      }
    
    
      res.json({ messages, count });
};

module.exports = {
    sendUsMessage,
    getSupportMessages
}
