export const formatDateRange =
  (type) => {
    const now = new Date();

    let startDate;

    switch (type) {
      case "daily":
        startDate = new Date(
          now.setHours(0, 0, 0, 0)
        );
        break;

      case "weekly":
        startDate = new Date(
          now.setDate(
            now.getDate() - 7
          )
        );
        break;

      case "monthly":
        startDate = new Date(
          now.setMonth(
            now.getMonth() - 1
          )
        );
        break;

      default:
        startDate = new Date(
          now.setMonth(
            now.getMonth() - 1
          )
        );
    }

    return {
      startDate,
      endDate: new Date(),
    };
  };