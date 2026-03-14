import Credit from "../Models/Credit.js";

const parseDueDate = (credit) => {
  const s = credit?.due;
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d;
};


const applyOverdueInterest = async (credit, now = new Date()) => {
  const dueDate = parseDueDate(credit);
  if (!dueDate) return credit;

  // if not overdue, return
  if (now <= dueDate) return credit;

  // prevent applying multiple times
  if (credit.lastInterestAppliedAt) return credit;

  const balance = Number(credit.balancePayable || credit.payable || 0);
  const originalRate = Number(credit.originalInterestRate || 0);

  if (balance <= 0 || originalRate <= 0) return credit;

  // new rate after due date
  const newRate = originalRate * 2;

  // calculate only the extra interest
  const extraRate = newRate - originalRate;
  const interestAmount = (balance * extraRate) / 100;

  const newTotal = balance + interestAmount;

  // update credit values
  credit.interestRatePercent = newRate;          // doubled rate
  credit.interest = `${newRate}%`;              // display
  credit.balancePayable = newTotal;             // balance including extra interest
  credit.payable = newTotal;                    // payable including extra interest
  credit.total = newTotal;                      // total including extra interest

  credit.lastInterestAppliedAt = now;           // mark interest applied

  await credit.save();

  return credit;
};


export const createCredit = async (req, res) => {
  try {
    const { name, received, due, amount, interest, total, payable } = req.body;

    if (!name || !received || !due) {
      return res.status(400).json({ message: "name, received, due are required" });
    }

    const parsedAmount = Number(amount ?? 0);
    const parsedTotal = Number(total ?? 0);
    const parsedPayable = Number(payable ?? 0);

    if ([parsedAmount, parsedTotal, parsedPayable].some((n) => Number.isNaN(n))) {
      return res
        .status(400)
        .json({ message: "amount, total and payable must be valid numbers" });
    }

const rate = Number(String(interest).replace("%",""));

const credit = await Credit.create({
  name,
  received,
  due,
  amount: parsedAmount,

  interestRatePercent: rate,   // current rate
  originalInterestRate: rate,  // original rate (NEVER CHANGE)

  interest: `${rate}%`,
  principalBalance: parsedAmount,
  balancePayable: parsedAmount,
  payable: parsedAmount
});


    return res.status(201).json(credit);
  } catch (error) {
    // log full error on server for easier debugging
    console.error("createCredit error:", error);
    return res.status(500).json({ message: error.message });
  }
};



export const getCredits = async (req, res) => {
  try {
  const { search, startDate, endDate } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: String(search), $options: "i" };
    }

    // received is stored as a date-string; we can do lexicographic range for yyyy-mm-dd safely
   if (startDate && endDate) {
  query.received = { $gte: String(startDate), $lte: String(endDate) };
}

const credits = await Credit.find(query).sort({ createdAt: -1 });

const now = new Date();
const updated = [];

for (const c of credits) {
  if (c?.due && c?.principalBalance > 0) {
    await applyOverdueInterest(c, now);
  }
  updated.push(c);
}

return res.json(updated);


  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const getCredit = async (req, res) => {
  try {
    const credit = await Credit.findById(req.params.id);
    if (!credit) return res.status(404).json({ message: "Credit not found" });

    await applyOverdueInterest(credit, new Date());
    return res.json(credit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const addCreditPayment = async (req, res) => {
  try {
    const { amountPaid, paidAt } = req.body;
    const paid = Number(amountPaid);

    if (!paid || paid <= 0) {
      return res.status(400).json({ message: "amountPaid must be > 0" });
    }

    const credit = await Credit.findById(req.params.id);
    if (!credit) return res.status(404).json({ message: "Credit not found" });

    // Make sure interest is applied up to payment time (if overdue)
    const paymentTime = paidAt ? new Date(paidAt) : new Date();
    await applyOverdueInterest(credit, paymentTime);

    const currentBalance = Number(
      Number(credit.principalBalance || 0) + Number(credit.interestAccrued || 0),
    );
    if (paid > currentBalance) {
      return res
        .status(400)
        .json({ message: "amountPaid cannot be greater than balancePayable" });
    }

    const newTotalPaid = Number(credit.totalPaid || 0) + paid;

    // Payment strategy you requested:
    // - reduce principalBalance first
    // - then reduce interestAccrued (if any principal is already cleared)
    let remainingPayment = paid;

    const principalBefore = Number(credit.principalBalance || 0);
    if (principalBefore > 0) {
      const principalPay = Math.min(principalBefore, remainingPayment);
      credit.principalBalance = Math.max(0, principalBefore - principalPay);
      remainingPayment -= principalPay;
    }

    if (remainingPayment > 0) {
      const interestBefore = Number(credit.interestAccrued || 0);
      const interestPay = Math.min(interestBefore, remainingPayment);
      credit.interestAccrued = Math.max(0, interestBefore - interestPay);
      remainingPayment -= interestPay;
    }

    const newBalance = Math.max(
      0,
      Number(credit.principalBalance || 0) + Number(credit.interestAccrued || 0),
    );

    credit.payments.push({
      paidAt: paymentTime,
      amountPaid: paid,
      balanceAfter: newBalance,
    });

    credit.totalPaid = newTotalPaid;
    credit.balancePayable = newBalance;
    credit.total = newBalance;
    credit.payable = newBalance;
    credit.status = newBalance === 0 ? "paid" : "unpaid";

    await credit.save();

    return res.json(credit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};





// export const updateOverdueCredit = async (req, res) => {
//   try {
//     const credit = await Credit.findById(req.params.id);

//     if (!credit) {
//       return res.status(404).json({ message: "Credit not found" });
//     }

//     credit.interest = req.body.interest;
//     credit.payable = req.body.payable;
//     credit.balancePayable = req.body.balancePayable;
//     credit.total = req.body.balancePayable;

//     await credit.save();

//     res.json(credit);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// import Credit from "../Models/Credit.js";
// import Credit from "../Models/Credit.js";

// /**
//  * Applies overdue interest to a credit if past due date
//  * and saves it immediately in the backend.
//  */
// export const applyOverdueInterest = async (credit, now = new Date()) => {
//   if (!credit || !credit.due) return credit;

//   const dueDate = new Date(credit.due);
//   if (now <= dueDate) return credit; // not overdue

//   // Already applied interest? skip
//   if (credit.lastInterestAppliedAt) return credit;

//   const balance = Number(credit.balancePayable || credit.payable || 0);
//   const originalRate = Number(credit.originalInterestRate || credit.interestRatePercent || 0);

//   if (balance <= 0 || originalRate <= 0) return credit;

//   // Double interest after due date
//   const newRate = originalRate * 2;
//   const extraRate = newRate - originalRate;

//   const interestAmount = (balance * extraRate) / 100;
//   const newTotal = balance + interestAmount;

//   // Update credit
//   credit.interestRatePercent = newRate;
//   credit.interest = `${newRate}%`;
//   credit.balancePayable = newTotal;
//   credit.payable = newTotal;
//   credit.total = newTotal;
//   credit.lastInterestAppliedAt = now;

//   // Save in backend immediately
//   await credit.save();

//   return credit;
// };

// // Create new credit
// export const createCredit = async (req, res) => {
//   try {
//     const { name, received, due, amount, interest } = req.body;
//     if (!name || !received || !due) return res.status(400).json({ message: "Required fields missing" });

//     const principal = Number(amount ?? 0);
//     const rate = Number(String(interest ?? "0").replace("%",""));

//     const credit = await Credit.create({
//       name,
//       received,
//       due,
//       amount: principal,
//       interest: `${rate}%`,
//       originalInterestRate: rate,
//       interestRatePercent: rate,
//       principalBalance: principal,
//       balancePayable: principal,
//       payable: principal,
//       total: principal,
//       status: "unpaid",
//     });

//     return res.status(201).json(credit);
//   } catch (err) {
//     console.error("createCredit error:", err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // Get all credits (automatically apply overdue interest)
// export const getCredits = async (req, res) => {
//   try {
//     const { search, startDate, endDate } = req.query;
//     const query = {};
//     if (search) query.name = { $regex: search, $options: "i" };
//     if (startDate && endDate) query.received = { $gte: startDate, $lte: endDate };

//     const credits = await Credit.find(query).sort({ createdAt: -1 });

//     const now = new Date();
//     for (const credit of credits) {
//       await applyOverdueInterest(credit, now);
//     }

//     return res.json(credits);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// // Add a payment
// export const addCreditPayment = async (req, res) => {
//   try {
//     const { amountPaid, paidAt } = req.body;
//     const paid = Number(amountPaid);
//     if (!paid || paid <= 0) return res.status(400).json({ message: "amountPaid must be > 0" });

//     const credit = await Credit.findById(req.params.id);
//     if (!credit) return res.status(404).json({ message: "Credit not found" });

//     // Apply overdue interest automatically before payment
//     const paymentTime = paidAt ? new Date(paidAt) : new Date();
//     await applyOverdueInterest(credit, paymentTime);

//     const balance = Number(credit.balancePayable || credit.payable || 0);
//     if (paid > balance) return res.status(400).json({ message: "Amount exceeds balance" });

//     // Reduce balance and update totals
//     const newBalance = balance - paid;
//     credit.totalPaid = (Number(credit.totalPaid) || 0) + paid;
//     credit.balancePayable = newBalance;
//     credit.payable = newBalance;
//     credit.total = newBalance;
//     credit.status = newBalance <= 0 ? "paid" : "unpaid";

//     credit.payments.push({
//       paidAt: paymentTime,
//       amountPaid: paid,
//       balanceAfter: newBalance,
//     });

//     await credit.save();
//     return res.json(credit);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };