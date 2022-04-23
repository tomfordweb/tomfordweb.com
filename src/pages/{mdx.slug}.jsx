import * as React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from "../components/layout";

const BlogPost = ({ data }) => {
  console.log(data.mdx);
  return (
    <Layout
      pageClass="BlogPost container"
      pageTitle={data.mdx.frontmatter.title}
    >
      <header class="mb-5">
        <h1 class="text-italic">{data.mdx.frontmatter.title}</h1>
        <time>{data.mdx.frontmatter.date}</time>
      </header>
      <MDXRenderer>{data.mdx.body}</MDXRenderer>
    </Layout>
  );
};
export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
      }
      body
    }
  }
`;
export default BlogPost;
