import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    meetingCode : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        default : Date.now,
        required : true
    }

});

meetingSchema.index({ user_id: 1, date: -1 });

const meetingModel = mongoose.model("Meeting", meetingSchema);

export default meetingModel;