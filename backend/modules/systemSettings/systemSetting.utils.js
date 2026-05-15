export const ensureSingleDocument =
  async (Model) => {
    const count = await Model.countDocuments();

    if (count === 0) {
      return await Model.create({});
    }

    return await Model.findOne();
  };
