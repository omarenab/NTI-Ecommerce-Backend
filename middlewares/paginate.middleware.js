module.exports = (Model) => async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sort || "createdAt";
  const order = req.query.order === "desc" ? -1 : 1;
  const filter = req.filter || {};
  try {
    const [result, total] = await Promise.all([
      Model.find(filter)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)
        .select("-password"),
      Model.countDocuments(filter),
    ]);
    res.paginateResult = {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalResult: total,
      result,
    };
    next();
  } catch (err) {
    res.status(500).json({ message: "Error in Pagination" });
  }
};
