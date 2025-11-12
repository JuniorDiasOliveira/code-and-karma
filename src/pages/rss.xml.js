import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('blog');
  
  // Sort posts by date (newest first)
  const sortedPosts = blog.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  
  return rss({
    // Required fields
    title: 'Code & Karma Blog',
    description: 'Exploring the edge of front-end development: React, TypeScript, design systems, and cutting-edge technologies.',
    site: context.site,
    
    // RSS items
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.excerpt,
      author: post.data.author,
      link: `/post/${post.slug}/`,
      categories: post.data.tags,
      
      // Additional metadata for each item
      customData: `
        <dc:creator><![CDATA[${post.data.author}]]></dc:creator>
        <guid isPermaLink="false">${context.site}/post/${post.slug}/</guid>
        <readTime>${post.data.readTime}</readTime>
      `.trim(),
    })),
    
    // Channel-level custom data
    customData: `
      <language>en-us</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <managingEditor>junior@karma-and-code.dev (Junior Dias)</managingEditor>
      <webMaster>junior@karma-and-code.dev (Junior Dias)</webMaster>
      <copyright>© ${new Date().getFullYear()} Karma &amp; Code. All rights reserved.</copyright>
      <category>Technology</category>
      <category>Web Development</category>
      <category>JavaScript</category>
      <category>TypeScript</category>
      <ttl>60</ttl>
      <image>
        <url>${context.site}/logo.webp</url>
        <title>Karma &amp; Code Blog</title>
        <link>${context.site}</link>
        <width>144</width>
        <height>144</height>
      </image>
    `.trim(),
    
    // Optional: pretty styling for browsers
    stylesheet: '/rss/pretty-feed-v3.xsl',
    
    // Namespace declarations for additional metadata
    xmlns: {
      dc: 'http://purl.org/dc/elements/1.1/',
      content: 'http://purl.org/rss/1.0/modules/content/',
      atom: 'http://www.w3.org/2005/Atom',
    },
  });
}