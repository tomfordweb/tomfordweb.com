import * as React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from "../components/layout";
import { Helmet } from "react-helmet";
import AboutContent from "../components/about-content";
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";

// markup
deckDeckGoHighlightElement();

const BlogPost = ({ data }) => {
  return (
    <Layout pageName="BlogPost">
      <Helmet>
        <title>{data.mdx.frontmatter.title} - tomfordweb.com</title>
      </Helmet>
      <header className="mb-5">
        <h1 className="fira-code-bold">{data.mdx.frontmatter.title}</h1>
        <time>{data.mdx.frontmatter.date}</time>
      </header>
      <MDXRenderer>{data.mdx.body}</MDXRenderer>
      <footer className="container text-center d-flex align-items-center">
        <AboutContent />
      </footer>
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
