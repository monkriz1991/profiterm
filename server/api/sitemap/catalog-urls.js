import CategoryModel from "~/server/models/Category";

export default defineSitemapEventHandler(async () => {
  const category = await CategoryModel.find();
  const generateUrls = (categories) => {
    let urls = [];

    categories.forEach((cat) => {
      urls.push({
        url: `/catalog/${cat.kirilica}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: cat.updated_at,
      });
    });

    return urls;
  };

  const urls = generateUrls(category);
  return urls;
});
