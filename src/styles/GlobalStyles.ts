import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #33312d;
    color: #FFF;
    font-family: Roboto, Arial, Helvetica, sans-serif;
  }

  a {
    text-decoration: none;    
    color: #FFF;
  }
  a:hover {
    color: #8527e5;
    transition: 0.8s;
  }
`;