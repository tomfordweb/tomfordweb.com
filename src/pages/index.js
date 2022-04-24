import * as React from "react";
import Layout from "../components/layout";
import { Link, graphql } from "gatsby";
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
import { Helmet } from "react-helmet";

// markup
deckDeckGoHighlightElement();

const IndexPage = ({ data }) => {
  return (
    <Layout pageClass="IndexPage container mb-5">
      <Helmet>
        <title>Fullstack Web Developer - tomfordweb.com</title>
        <meta
          name="description"
          content="This is the technical blog of Tom Ford, a Web Developer based out of
          Kalamazoo, Michigan."
        />
      </Helmet>
      <section>
        {data.allMdx.nodes.map((node) => (
          <article key={node.id} className="blog-excerpt">
            <header>
              <h1>
                <Link to={`/${node.slug}`}>{node.frontmatter.title}</Link>
              </h1>
              <time dateTime={node.frontmatter.date}>
                {node.frontmatter.date}
              </time>
            </header>
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
