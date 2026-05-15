export const setDefaultAddress =
  (addresses, index) => {
    return addresses.map(
      (addr, i) => ({
        ...addr,
        isDefault: i === index,
      })
    );
  };