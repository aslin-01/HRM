import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({

  employee:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Employee",
    required:true
  },

  employeeId:{
    type:String,
    required:true
  },

  name:{
    type:String,
    required:true
  },

  inTime:{
    type:String,
    default:"-"
  },

  outTime:{
    type:String,
    default:"-"
  },

  status:{
    type:String,
    default:"-"
  },

  salary:{
    type:Number,
    default:0
  },

  advancePaid:{
    type:Number,
    default:0
  },

  date:{
    type:Date
  }

},{timestamps:true});

export default mongoose.model("Attendance",attendanceSchema);