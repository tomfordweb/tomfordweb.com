import * as React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from "../components/layout";
import { Helmet } from "react-helmet";
import AboutContent from "../components/about-content";
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
import { Title } from "../components/title";

// markup
deckDeckGoHighlightElement();

const BlogPost = ({ data }) => {
  return (
    <Layout pageName="BlogPost">
      <Helmet>
        <title>{data.mdx.frontmatter.title} - tomfordweb.com</title>
      </Helmet>
      <header className="mb-5">
        <Title >{data.mdx.frontmatter.title}</Title>
        {data.mdx.frontmatter.icon && <i className={data.mdx.frontmatter.icon + " me-3"} />}
        <time>{data.mdx.frontmatter.date}</time>
      </header>
      <MDXRenderer>{data.mdx.body}</MDXRenderer>
      <hr className="my-5 col-6 offset-3" />
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
        icon
      }
      body
      tableOfContents
      timeToRead
    }
  }
`;
export default BlogPost;
