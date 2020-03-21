
const apiPath = '/api/v1/';
const dev = `//${ process.env.REACT_APP_EXTERNAL_HOSTNAME }:${ process.env.REACT_APP_EXTERNAL_BIND_PORT }${ apiPath }`;
const prod = `${ apiPath }`;

export const apiBase = ( process.env.NODE_ENV === 'development' ) 
  ? dev
  : prod;

