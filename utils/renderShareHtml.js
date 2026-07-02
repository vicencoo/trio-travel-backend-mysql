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
  </head>

  <body>
    <script>
      window.location.href = "${url}";
    </script>
  </body>
</html>
`;

module.exports = renderShareHtml;
