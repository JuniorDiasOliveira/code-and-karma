<!--
# Pretty Feed

Styles an RSS/Atom feed, making it friendly for humans viewers, and adds a link
to feedburner. See it in action:

   http://www.intertwingly.net/blog/index.atom

## How to use

1. Copy this XML stylesheet to your server.
2. Reference it from your RSS/Atom feeds by adding the following line after the
   opening `<?xml version="1.0" encoding="UTF-8"?>` tag:

   <?xml-stylesheet type="text/xsl" href="/pretty-feed-v3.xsl"?>

3. Optionally customize the `site-url` and `site-title` variables.

This is a modified version of a pretty feed from https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl
-->
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> Web Feed</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <style type="text/css">
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: #333;
            background-color: #f8f9fa;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 2rem;
          }
          .header h1 {
            margin: 0 0 0.5rem 0;
            font-size: 2rem;
          }
          .header p {
            margin: 0;
            opacity: 0.9;
          }
          .info {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            margin-bottom: 2rem;
          }
          .info h2 {
            margin-top: 0;
            color: #495057;
          }
          .items {
            background: white;
            border-radius: 8px;
            border: 1px solid #e9ecef;
          }
          .item {
            padding: 1.5rem;
            border-bottom: 1px solid #e9ecef;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item h3 {
            margin: 0 0 0.5rem 0;
          }
          .item h3 a {
            color: #495057;
            text-decoration: none;
          }
          .item h3 a:hover {
            color: #667eea;
          }
          .item-meta {
            font-size: 0.9rem;
            color: #6c757d;
            margin-bottom: 0.5rem;
          }
          .item p {
            margin: 0;
            color: #495057;
          }
          .subscribe-info {
            color: #666;
          }
          .subscribe-info a {
            color: #667eea;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p><xsl:value-of select="/rss/channel/description"/></p>
          </div>
          
          <div class="info">
            <h2>📡 What is a RSS feed?</h2>
            <p class="subscribe-info">This is a RSS feed. RSS feeds allow you to stay up to date with websites in a simple way that can be read by a feed reader. <a href="https://aboutfeeds.com/" target="_blank">Learn more about RSS feeds</a> and how to use them.</p>
          </div>
          
          <div class="items">
            <xsl:for-each select="/rss/channel/item">
              <div class="item">
                <h3><a href="{link}" target="_blank"><xsl:value-of select="title"/></a></h3>
                <div class="item-meta">
                  <xsl:value-of select="pubDate"/>
                </div>
                <p><xsl:value-of select="description"/></p>
              </div>
            </xsl:for-each>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>