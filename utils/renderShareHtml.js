const renderShareHtml = ({ title, description, image, url }) => {
  const upperTitle = (title || "").toLocaleUpperCase("sq-AL");
  return `
  <!doctype html>
  <html>
    <head>
      <title>${upperTitle}</title>

      <meta property="og:title" content="${upperTitle}" />
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
};

module.exports = renderShareHtml;
