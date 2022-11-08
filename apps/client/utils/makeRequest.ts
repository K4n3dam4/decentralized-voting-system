import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Make api request
 * @param queryParams
 */
const queryString = (queryParams: { [x: string]: any }) =>
  `?${Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&')}`;

/**
 *
 * @param requestConfig
 * @param queryParams
 * @param baseUrl
 */
const makeRequest = <Res, D, QP = void>(
  requestConfig: AxiosRequestConfig,
  queryParams: QP | Record<string, any>,
  baseUrl = '/api/',
): Promise<AxiosResponse<Res, D>> => {
  const { method = 'GET', url, data } = requestConfig;
  const concatQP = (api: string, qp: typeof queryParams) => (Object.keys(qp).length > 0 ? api + queryString(qp) : api);

  const completeUrl = concatQP(baseUrl + url, queryParams);

  return axios({
    method,
    url: completeUrl,
    data,
  });
};

export default makeRequest;
