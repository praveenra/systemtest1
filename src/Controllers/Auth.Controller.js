const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const CryptoJS = require('crypto-js');

const encryptWithAES = text => {
  const passphrase = process.env.ACCESS_TOKEN_SECRET;
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

const decryptWithAES = ciphertext => {
  const passphrase = process.env.ACCESS_TOKEN_SECRET;
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

module.exports = {
  savedetails: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);

      result.account_number = await encryptWithAES(result.account_number);
      result.ifsc_code = await encryptWithAES(result.ifsc_code);
      

      const user = new User(result);
      const savedUser = await user.save();
      
      const response = {
        status:200,
        message:"your details saved successfully",
        data:savedUser
      }

      res.send(response)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  getlist: async (req, res, next) => {
    try {
      const users = await User.find();

      Object.entries(users).forEach(entry => {
        const [key, value] = entry;
        users[key].account_number = decryptWithAES(value.account_number);
        users[key].ifsc_code = decryptWithAES(value.ifsc_code);
      });
      const response = {
        status:200,
        message:"users List",
        data:users
      }
      res.send(response);
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  updatedetails: async (req, res, next) => {
    try {
      const result = req.body;
      result.account_number = await encryptWithAES(result.account_number);
      result.ifsc_code = await encryptWithAES(result.ifsc_code);

      const user = new User(result);

      const where = { "_id" : result._id };
      var newvalues = { $set: {
        "name":result.name,
        "account_number":result.account_number,
        "ifsc_code":result.ifsc_code,
        "amount":result.amount
      }  };

      const updatedUser = await User.updateOne(where, newvalues);  
      
      const response = {
        status:200,
        message:"User Updated successfully",
        data:updatedUser
      }
      res.send(response)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  deletedetails: async (req, res, next) => {
    try {
      const result = req.body;
      const user = new User(result);
      const where = {"_id":result._id};
      const updatedUser = await user.remove(where);      
      const response = {
        status:200,
        message:"User deleted successfully",
        data:updatedUser
      }
      res.send(response)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

}
