import * as React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";
import { Helmet } from "react-helmet";
import { Title } from "../components/title";

// markup
const NotFoundPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Not found</title>
      </Helmet>
      <header className="d-flex justify-content-start align-items-center">
        <Title icon="bi bi-exclamation-circle text-warning">Page not found</Title>
      </header>
      <hr />
      <p>
        Sorry, we couldn’t find what you were looking for.
      </p>

      <Link className="btn btn-primary" to="/">Go home</Link>
    </Layout>
  );
};

export default NotFoundPage;
