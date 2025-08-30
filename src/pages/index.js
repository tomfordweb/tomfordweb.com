import * as React from "react";
import Layout from "../components/layout";
import { Link, graphql } from "gatsby";
import { Helmet } from "react-helmet";
import AboutContent from "../components/about-content";


const IndexPage = ({ data }) => {
  return (
    <Layout pageName="IndexPage">
      <Helmet>
        <title>tomfordweb.com | Web Developer</title>
      </Helmet>
      <div className="row">
        <section className="col-12 col-lg-9">
          {data.allMdx.nodes.map((node) => (
            <article key={node.id} className="blog-excerpt mb-5">
              <header>
                <h1 className="fira-code-bold">
                  <Link to={`/${node.slug}`} className="text-decoration-none text-primary">{node.frontmatter.title}</Link>
                </h1>
              </header>
              <p className="mb-5">{node.excerpt}</p>
              <footer className="d-flex justify-content-between">
                <Link to={`/${node.slug}`} className="btn btn-info p-3">Read more</Link>
                <time dateTime={node.frontmatter.date} className="text-white-50">
                  {node.frontmatter.date}
                </time>
              </footer>
            </article>
          ))}
        </section>
        <aside className="col-12 col-md-8 col-md-offset-2 col-lg-3 col-lg-offset-0 d-flex flex-column">
          <AboutContent />
        </aside>
      </div>
    </Layout>
  );
};

export const query = graphql`
        query {
          allMdx(sort: {fields: frontmatter___date, order: DESC }) {
          nodes {
          frontmatter {
          date(formatString: "MMMM D, YYYY")
        title
        }
        slug
        id
        excerpt(pruneLength: 500)
      }
    }
  }
        `;
export default IndexPage;
