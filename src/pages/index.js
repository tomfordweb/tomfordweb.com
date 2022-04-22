import * as React from "react";
import Layout from "../components/layout";
import { Link, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";

// markup
const IndexPage = ({ data }) => {
  return (
    <Layout>
      <section className="excerpts">
        {data.allMdx.nodes.map((node) => (
          <article key={node.id} className="blog-excerpt">
            <h1>
              <Link to={`/${node.slug}`}>{node.frontmatter.title}</Link>
            </h1>
            <time dateTime={node.frontmatter.date}>
              {node.frontmatter.date}
            </time>
          </article>
        ))}
      </section>
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
