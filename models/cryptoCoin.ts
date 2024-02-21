import mongoose from 'mongoose';


const cryptoCoinSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true },
        symbol: { type: String },
        name: { type: String },
    }
)
let CryptoCoin = mongoose.model("CryptoCoin", cryptoCoinSchema);

export default CryptoCoin;