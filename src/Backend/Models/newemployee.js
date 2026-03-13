import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    dob: {
      type: Date,
      required: true
    },

    age: {
      type: Number
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },

    address: {
      type: String
    },

    phone: {
      type: String
    },

    agent: {
      type: String
    },

    salary: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);


// Auto calculate age (synchronous pre-save hook)
employeeSchema.pre("save", function () {
  if (this.dob) {
    const today = new Date();
    const birth = new Date(this.dob);

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    this.age = age;
  }
});


export default mongoose.model("Employee", employeeSchema);