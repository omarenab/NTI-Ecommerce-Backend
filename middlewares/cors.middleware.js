const cors = require("cors");

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
const corsOptions = {
  origin: function (origin, cb) {
    if (!origin) {
      return cb(null, true);
    } else if (allowedOrigins.includes(origin)) {
      return cb(null, true);
    }else {
        return cb(new Error('cors policy: origin not allowed'))
    }
  },
  methods:['GET','POST','PUT','DELETE'],
  credentials : true, // 7aga zy el cookies / authentication / authorization
  allowedHeaders : ['Content-type','Authorization']
};
module.exports = cors(corsOptions)
