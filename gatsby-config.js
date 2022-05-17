require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    siteUrl: `https://www.yourdomain.tld`,
    title: "Gemserve Bulk Attendance"
  },
  plugins: [
    'gatsby-plugin-postcss',
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] },
    }
  ],
}
