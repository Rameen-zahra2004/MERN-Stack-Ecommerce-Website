export const generateSlug =
  (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(/(^-|-$)/g, "");
  };


export const calculateDiscount =
  (price, comparePrice) => {
    if (!comparePrice) return 0;

    return (
      ((comparePrice - price) /
        comparePrice) *
      100
    ).toFixed(2);
  };