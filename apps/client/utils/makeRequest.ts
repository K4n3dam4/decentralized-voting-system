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
  const { method = 'GET', url } = requestConfig;
  const concatQP = (api: string, qp: typeof queryParams) => (Object.keys(qp).length > 0 ? api + queryString(qp) : api);

  const completeUrl = concatQP(baseUrl + url, queryParams);

  console.log(completeUrl);

  return axios({
    ...requestConfig,
    method,
    url: completeUrl,
  });
};

export default makeRequest;
