export const generateSummary = async ({ url }: { url: string }) => {
  const res = await fetch("/api/guest", {
    method: "POST",
    body: JSON.stringify({ url }),
  });

  return res;
};
