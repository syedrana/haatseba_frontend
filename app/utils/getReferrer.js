export function getReferrerInfo(user) {
  if (!user?.parentId) {
    return {
      name: "N/A",
      level: "N/A",
      email: "N/A",
      phone: "N/A",
    };
  }

  const { firstName = "", lastName = "", level = 0, email = "N/A", phone = "N/A" } = user.parentId;

  return {
    name: `${firstName} ${lastName}`.trim() || "N/A",
    level: level ?? 0,
    email,
    phone,
  };
}
