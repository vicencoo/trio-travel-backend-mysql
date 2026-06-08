const renderShareHtml = ({ title, description, image, url }) => `
<!doctype html>
<html>
  <head>
    <title>${title}</title>

    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:secure_url" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta http-equiv="refresh" content="0;url=${url}" />
  </head>

  <body>Redirecting...</body>
</html>
`;

module.exports = renderShareHtml;
