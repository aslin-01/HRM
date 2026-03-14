import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paidAt: { type: Date, required: true, default: Date.now },
    amountPaid: { type: Number, required: true, min: 0 },
    balanceAfter: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const creditSchema = new mongoose.Schema(
  {
    // keep same frontend naming to avoid logic changes
    name: { type: String, required: true, trim: true },
    received: { type: String, required: true }, // usually yyyy-mm-dd from <input type="date" />
    due: { type: String, required: true }, // usually yyyy-mm-dd

    // original principal amount (keep field name used by UI table)
    amount: { type: Number, required: true }, // principal amount

    // UI input (keep field name), e.g. "10%"
    interest: { type: String, required: true },
    
oldInterestRate: {
  type: Number,
},

newInterestRate: {
  type: Number,
},

lastInterestAppliedAt: {
  type: Date,
},
    // normalized numeric interest rate
    interestRatePercent: { type: Number, required: true, min: 0 },

    // principal tracking (payments reduce this first)
    principalBalance: { type: Number, required: true, min: 0 },

    // interest accrued after due date (does not get reduced until principal hits 0)
    interestAccrued: { type: Number, default: 0, min: 0 },
    lastInterestAppliedAt: { type: Date, default: null },

    // derived totals for UI (kept for compatibility; updated by backend)
    total: { type: Number, required: true }, // current total due now
    payable: { type: Number, required: true }, // current amount to be paid now

    status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },

    payments: { type: [paymentSchema], default: [] },
    totalPaid: { type: Number, default: 0, min: 0 },
    balancePayable: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

const parsePercent = (value) => {
  if (value === null || value === undefined) return 0;
  const s = String(value).trim().replace("%", "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

// initialize derived fields on create / keep derived fields consistent
creditSchema.pre("validate", function preValidate() {
  if (this.isNew) {
    const principal = Number(this.amount) || 0;
    const rate = parsePercent(this.interest);
    this.interestRatePercent = Number(this.interestRatePercent ?? rate) || rate;

    this.totalPaid = 0;
    this.principalBalance = Number(this.principalBalance ?? principal) || principal;
    // base interest (one-time) from UI: principal * rate%
    const baseInterest =
      Math.round((principal * (this.interestRatePercent / 100)) * 100) / 100;
    this.interestAccrued = Number.isFinite(baseInterest) ? baseInterest : 0;
    this.lastInterestAppliedAt = null;

    const totalDue = Math.max(0, this.principalBalance + this.interestAccrued);
    this.total = totalDue;
    this.payable = totalDue;
    this.balancePayable = totalDue;
    this.status = totalDue <= 0 ? "paid" : "unpaid";
  } else {
    // keep UI totals consistent with stored balances
    const totalDue = Math.max(
      0,
      Number(this.principalBalance || 0) + Number(this.interestAccrued || 0),
    );
    this.total = totalDue;
    this.payable = totalDue;
    this.balancePayable = totalDue;
    this.status = totalDue <= 0 ? "paid" : "unpaid";
  }
});

const Credit = mongoose.model("Credit", creditSchema);

export default Credit;

