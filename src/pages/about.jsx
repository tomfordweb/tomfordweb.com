import React from "react";
import Layout from "../components/layout";

const AboutPage = () => {
  return (
    <Layout pageClass="AboutPage container">
      <h1>About Me</h1>
      <p>
        Hey there, My name is Tom and I am a full stack developer with over 12
        years of experience creating products for the web. I currently work as a
        Senior Developer and Scrum Master at{" "}
        <a href="https://www.mhvillage.com">www.mhvillage.com</a>.
      </p>
    </Layout>
  );
};

export default AboutPage;
