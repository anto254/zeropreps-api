const Chat = require("../models/Chat");
const sendSms = require("../utils/sms");

const addMessage = async (req, res) => {
  const { message, clientId, senderId } = req.body;

  if (!message || !senderId || !clientId)
    return res.status(400).json({ message: "All fields are required" });

    if(clientId === senderId) {
      sendSms.sendAnSms("254768702540", "You have a new message " )
  }

  try {
    let chat = await Chat.findOne({ clientId: clientId }).exec();
    if (!chat) {
      chat = new Chat({
        clientId: clientId,
        adminUnread: 1,
        messages: [
          {
            senderId: senderId,
            message: message,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    } else {
        if(clientId === senderId) {
            chat.adminUnread += 1;
        }
      chat.messages.push({
        senderId: senderId,
        message: message,
        createdAt: new Date().toISOString(),
      });
    }

    await chat.save();
    res.status(200).json({ message: "sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!" });
  }
};

const getChatByClientId = async (req, res) => {
  const { clientId } = req.params;

  if (!clientId)
    return res.status(400).json({ message: "client id is required" });

  try {
    const chat = await Chat.findOne({ clientId: clientId }).exec();
    if (!chat) return res.status(200).json({ message: "No chat found" });

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!" });
  }
};

const getChatByClientIdAdmin = async (req, res) => {
  const { clientId } = req.params;

  if (!clientId)
    return res.status(400).json({ message: "client id is required" });

  try {
    const chat = await Chat.findOne({ clientId: clientId }).exec();
    if (!chat) return res.status(200).json({ message: "No chat found" });

    chat.adminUnread = 0;
    await chat.save();

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!" });
  }
};

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ updatedAt: -1 }).lean().exec();
    if (!chats.length)
      return res.status(200).json({ message: "No chat found" });

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!!" });
  }
};

const countAdminUnread = async (req, res) => {
    try {
            let totalAdminUnread = 0;
      const supports = await Chat.find({ adminUnread: { $gt: 0 } }).select('adminUnread').lean().exec(); // Get only the support documents where adminUnread is greater than zero
      
  
      
      if(supports.length < 1) return res.status(200).json({ totalAdminUnread });
  
      for (let support of supports) {
        totalAdminUnread += support.adminUnread; // Add up the adminUnread of each document
      }
      
  
      res.status(200).json({ totalAdminUnread }); // Return the total adminUnread
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  const deleteChat = async(req, res) => {
    const {chatId} = req.params;
    if(chatId) res.status(400).json({ message: 'Chat id is required' });

    try {
      await Chat.findByIdAndDelete(chatId);
      res.status(200).json({message: "Chat deleted"});
      
    } catch (error) {
      console.log(error)
      
    }
  }



module.exports = {
  addMessage,
  getChatByClientId,
  getAllChats,
  getChatByClientIdAdmin,
  countAdminUnread,
  deleteChat
};
