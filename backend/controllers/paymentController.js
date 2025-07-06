exports.simulateCallback = async (req, res) => {
  const { orderId, status, receipt } = req.body;
  try {
    await Transaction.create({
      orderId,
      status,
      mpesaReceipt: receipt,
    });
    res.json({ msg: "Callback processed" });
  } catch (err) {
    res.status(500).json({ msg: "Callback failed" });
  }
};
