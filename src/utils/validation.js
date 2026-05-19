export function hasRequiredFields(data, fields) {
  return fields.every((field) => {
    const value = data[field];
    return value !== undefined && value !== null && String(value).trim() !== "";
  });
}

export function isPositiveNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

