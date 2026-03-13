import Credit from "../Models/Credit.js";

const parseDueDate = (credit) => {
  const s = credit?.due;
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d;
};

// Interest strategy (credit-only):
// - Interest starts accruing AFTER due date
// - Interest is calculated on remaining principalBalance only
// - Rate is treated as "% per month" and prorated daily using 30-day month
const applyOverdueInterest = async (credit, now = new Date()) => {
  const dueDate = parseDueDate(credit);
  if (!dueDate) return credit;

  const ratePercent = Number(credit.interestRatePercent || 0);
  if (ratePercent <= 0) return credit;

  // Only apply after due date
  if (now <= dueDate) return credit;

  const start =
    credit.lastInterestAppliedAt && credit.lastInterestAppliedAt > dueDate
      ? credit.lastInterestAppliedAt
      : dueDate;

  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.floor((now.getTime() - start.getTime()) / msPerDay);
  if (days <= 0) return credit;

  const principal = Math.max(0, Number(credit.principalBalance || 0));
  if (principal <= 0) {
    credit.lastInterestAppliedAt = now;
    await credit.save();
    return credit;
  }

  const dailyRate = ratePercent / 100 / 30;
  const interestToAdd = principal * dailyRate * days;

  // round to 2 decimals for money safety
  const rounded = Math.round(interestToAdd * 100) / 100;

  credit.interestAccrued = Math.max(0, Number(credit.interestAccrued || 0) + rounded);
  credit.lastInterestAppliedAt = now;

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

    const credit = await Credit.create({
      name,
      received,
      due,
      amount: parsedAmount,
      interest: String(interest ?? ""),
      // principal starts as amount; derived totals are computed in model hook
      principalBalance: parsedAmount,
      status: req.body.status || "unpaid",
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
    const { search, fromDate, toDate } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: String(search), $options: "i" };
    }

    // received is stored as a date-string; we can do lexicographic range for yyyy-mm-dd safely
    if (fromDate && toDate) {
      query.received = { $gte: String(fromDate), $lte: String(toDate) };
    }

    const credits = await Credit.find(query).sort({ createdAt: -1 });

    // Apply overdue interest lazily so UI always sees up-to-date totals
    const now = new Date();
    const updated = [];
    for (const c of credits) {
      // only touch docs that could be overdue
      if (c?.due && c?.principalBalance > 0) {
        await applyOverdueInterest(c, now);
      }
      updated.push(c);
    }
    return res.json(credits);
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

