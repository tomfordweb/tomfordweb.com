import React from "react";
import Layout from "../components/layout";

const AboutPage = () => {
  return (
    <Layout>
      <h1>About Me</h1>
      <p>
        Hey there, My name is Tom and I am a full stack developer with over 12
        years of experience creating products for the web. I currently work as a
        Senior developer at www.mhvillage.com.
      </p>

      <h2>Fun Facts</h2>
      <ul>
        <li>I have built two race engines.</li>
        <li>
          At this point I have forgotten how to write code without vim keybinds.
        </li>
        <li>I am the proud parent of two cats.</li>
      </ul>
    </Layout>
  );
};

export default AboutPage;
