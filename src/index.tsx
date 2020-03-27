import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider } from '@apollo/react-hooks'; //peruskonffi
import { ApolloClient } from 'apollo-client'; //peruskonffi
import { InMemoryCache } from 'apollo-cache-inmemory'; //peruskonffi
import { setContext } from 'apollo-link-context'; //peruskonffi
//import {createUploadLink} from 'apollo-upload-client'
import { createHttpLink } from 'apollo-link-http';

import { split } from 'apollo-link'; //subscription
import { WebSocketLink } from 'apollo-link-ws'; //subscription
import { getMainDefinition } from 'apollo-utilities'; //subscription

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: { reconnect: true }
});

/* const uploadlink=createUploadLink({  
  uri:'http://localhost:4000/graphql',
}) */
const httplink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
  /* const token = localStorage.getItem('cba-usertoken') */
  //tällähetkellä cookiessit hoitaa autentikoinnit
  return {
    headers: {
      ...headers
      /* authorization: token ? `bearer ${token}` : null, */
    }
  };
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httplink)
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
serviceWorker.unregister()
/* serviceWorker.register(); */
