import axios, { AxiosRequestConfig } from 'axios';

const queryString = (queryParams: { [x: string]: any }) =>
  `?${Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&')}`;

const makeRequest = <Res, QP = void>(
  requestConfig: AxiosRequestConfig,
  queryParams: QP | Record<string, any>,
  baseUrl = '/api/',
): Promise<Res> => {
  const { method = 'GET', url, data } = requestConfig;
  const concatQP = (api: string, qp: typeof queryParams) => (Object.keys(qp).length > 0 ? api + queryString(qp) : api);

  const completeUrl = concatQP(baseUrl + url, queryParams);
  console.log(completeUrl);

  return axios({
    method,
    url: completeUrl,
    data,
  });
};

export default makeRequest;
