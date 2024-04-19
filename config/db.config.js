import mongoose from "mongoose";

/* No need to use 
    useNewUrlParser: true,
    useUnifiedTopology: true,
  as they are deprecated
*/

const connect = async (url) => {
  await mongoose.connect(
    url,
    // No need in newer version
    // {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // }
  );
};

export default connect;
