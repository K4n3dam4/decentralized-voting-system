import React from 'react';
import { NextPageContext } from 'next';
import { getServerSideProps as dvsGetServerSideProps } from '../../_app';

export const getServerSideProps = (ctx: NextPageContext) => {
  return dvsGetServerSideProps(ctx);
};

const Election = (props) => {
  return <div>Test</div>;
};

export default Election;
