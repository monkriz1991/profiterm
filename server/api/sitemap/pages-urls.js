export default defineSitemapEventHandler(async () => {
  //try {
  const pages = ["/", "all", "installment", "about", "contacts"];

  if (!pages || !Array.isArray(pages)) {
    throw new Error("Invalid response data");
  }

  // Формирование URL
  const urls = pages.map((item) => ({
    url: `${item}`,
    changefreq: "weekly",
    priority: 0.8,
  }));

  return urls;
});
