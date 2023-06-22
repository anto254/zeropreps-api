const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//get all users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if(!users?.length) {
        return res.status(400).json({message: "No users fond"});

    }
    res.json(users);

})

//create new user
const createNewUser = asyncHandler(async (req, res) => {
    const { userName, password } =req.body;

  

    //confirming required data
    if(!userName || !password ) {
        return res.status(400).json({message: "All fields required"});
    }

    //checking duplicates
    const dupUserName =  await User.findOne({userName: {$regex: userName, $options: "i"}}).lean().exec();

    if(dupUserName) {
        return res.status(409).json({message: "A user with the same user name already exists"});
    }
  
  

    //hash password
    const hashedPwd = await bcrypt.hash(password, 10);
    const roles = ["Admin"]

    const userObject = {userName, "password": hashedPwd, roles };

    //create and store user
    const user = await User.create(userObject);

    if(user) {
        res.status(201).json({message: `Welcome  ${userName}`});
    }else{
        res.status(400).json({message: "Invalid user data received"});
    }
    
})

//update user
// const updateUser = asyncHandler(async (req, res) => {
//     const {user_Id} = req?.params;
//     const {userId, fullName, phoneNo1, phoneNo2, password, email } =req.body;
//       // Confirm data 
//       if (!userId || !fullName  || !phoneNo1 || !email ) {
//         return res.status(400).json({ message: 'All fields except password are required' })
//     }

//      // Does the user exist to update?
//      const user = await User.findById({_id: user_Id}).exec()

//      if (!user) {
//          return res.status(400).json({ message: 'User not found' })
//      }

//      //checking duplicates
//     const dupUserId = await User.findOne({userId}).collation({ locale: 'en', strength: 2 }).lean().exec();
//     const dupEmail = await User.findOne({email}).collation({ locale: 'en', strength: 2 }).lean().exec();
//     const dupPhone1 = await User.findOne({phoneNo1}).collation({ locale: 'en', strength: 2 }).lean().exec();
//     const dupPhone2 = await User.findOne({phoneNo2}).collation({ locale: 'en', strength: 2 }).lean().exec();

//     if(dupUserId && dupUserId?._id.toString() !== user_Id) {
//         return res.status(409).json({message: "A user with the same ID/Passport already exists"});
//     }
//     if(dupEmail && dupEmail?._id.toString() !== user_Id) {
//         return res.status(409).json({message: "A user with the same email already exists"});
//     }
//     if(dupPhone1 && dupPhone1?._id.toString() !== user_Id) {
//         return res.status(409).json({message: "A user with the same phone number already exists"});
//     }
//     if(dupPhone2 && dupPhone2?._id.toString() !== user_Id) {
//         return res.status(409).json({message: "A user with the same phone number already exists"});
//     }

//     user.userId = userId;
//     user.fullName= fullName;
//     user.phoneNo1 = phoneNo1;
//     user.phoneNo2= phoneNo2;
//     user.email= email;

//     if (password) {
//         // Hash password 
//         user.password = await bcrypt.hash(password, 10) // salt rounds 
//     }

//     const updatedUser = await user.save()

//     res.json({ message: `${updatedUser.fullName} updated` })
    

    
// })


// //getUser by ID
// const getUserById = async (req, res) => {
//     if(!req?.params?.userId) return res.status(400).json({message: "id is required"});
//     const user = await User.findOne({_id: req.params.userId}).select('-password').lean().exec();

//     if(!user) {
//         return res.status(204).json({message: `No user matches id: ${req.params.userId}`});
//     }
//     res.json(user);
// }





// //delete user
// const deleteUser = asyncHandler(async (req, res) => {
//     const {userId} = req.params;
//     const user = User.findById({_id: userId}).exec();

//     if(!user) return res.status(400).json({message: "Something went wrong, refresh the page and try again"});

//     await User.findOneAndDelete({_id: userId}).exec();

//     res.status(200).json({message: "User deleted successfully"});
// })

module.exports = {
    getAllUsers,
    createNewUser,
    // updateUser,
    // deleteUser,
    // getUserById
}