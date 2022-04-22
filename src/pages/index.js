import * as React from "react";
import Layout from "../components/layout";
import { Link, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";

// markup
const IndexPage = ({ data }) => {
  return (
    <Layout>
      <h1>Hello</h1>
      {data.allMdx.nodes.map((node) => (
        <section key={node.id}>
          <h3>
            <Link href={`/${node.slug}`}>{node.frontmatter.title}</Link>
          </h3>
          <p>{node.frontmatter.date}</p>
          <MDXRenderer>{node.body}</MDXRenderer>
        </section>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query {
    allMdx(sort: { fields: frontmatter___date, order: DESC }) {
      nodes {
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
        }
        slug
        id
        body
      }
    }
  }
`;
export default IndexPage;
