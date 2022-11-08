import React from 'react';
import { NextPageContext } from 'next';
import { getServerSideProps as dvsGetServerSideProps } from '../../config/DVS';

export const getServerSideProps = (ctx: NextPageContext) => {
  return dvsGetServerSideProps(ctx);
};

const Admin = (props) => {
  return <span>Test</span>;
};

export default Admin;
