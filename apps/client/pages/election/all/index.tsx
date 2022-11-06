import React from 'react';
import { NextPageContext } from 'next';
import { getServerSideProps as dvsGetServerSideProps } from '../../_app';

const Election = (props) => {
  return <div>Test</div>;
};

export const getServerSideProps = (ctx: NextPageContext) => {
  return dvsGetServerSideProps(ctx);
};

export default Election;
