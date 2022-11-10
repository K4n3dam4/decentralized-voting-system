import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CookieValueTypes } from 'cookies-next';

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
 * @param ssr
 * @param baseUrl
 */
const makeRequest = <Res, D, QP = void>(
  requestConfig: AxiosRequestConfig,
  queryParams: QP | Record<string, any> = {},
  ssr = false,
  baseUrl = '/api/',
): Promise<AxiosResponse<Res, D>> => {
  const { method = 'GET', url } = requestConfig;
  const concatQP = (api: string, qp: typeof queryParams) => (Object.keys(qp).length > 0 ? api + queryString(qp) : api);

  if (ssr) baseUrl = process.env.API + 'api/';

  const completeUrl = concatQP(baseUrl + url, queryParams);

  return axios({
    ...requestConfig,
    method,
    url: completeUrl,
  });
};

export const createBearer = (token: CookieValueTypes) => ({
  Authorization: `Bearer ${token}`,
});

export default makeRequest;
