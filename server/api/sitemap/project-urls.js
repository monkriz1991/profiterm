import ProjectModel from "~/server/models/Project";

export default defineSitemapEventHandler(async () => {
  const project = await ProjectModel.find();
  const generateUrls = (projects) => {
    let urls = [];

    projects.forEach((item) => {
      urls.push({
        url: `/project/${item.kirilica}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: item.updated_at,
      });
    });

    return urls;
  };

  const urls = generateUrls(project);
  return urls;
});
