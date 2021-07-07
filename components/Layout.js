import React from "react";
import { Container } from "semantic-ui-react";
import Header from "./Header";
import Head from 'next/head';

const Layout = (props) => {
  return (
    <div>
       <Head>
            <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
          ></link>
        </Head>
      <Container>
      <Header />
      {props.children}
      </Container>
    </div>
  );
};
export default Layout;
