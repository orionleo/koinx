import mongoose from 'mongoose';


const cryptoCoinSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true, required: true },
        symbol: { type: String, required: true },
        name: { type: String, required: true },
    }
)
let CryptoCoin = mongoose.model("CryptoCoin", cryptoCoinSchema);

export default CryptoCoin;