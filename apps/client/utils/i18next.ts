import { UserConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import nextI18NextConfig from '../next-i18next.config';

/**
 * ==== WORKAROUND ====
 * i18next currently has a bug when run with nx commands originating from the repo's root dir.
 * ssrTranslations can be used in the app's pages to avoid having to import i18next's config in all of them.
 */

/**
 * ssr translations with default config
 * @param locale
 * @param namespacesRequired
 * @param configOverride
 * @param extraLocales
 */
export const ssrTranslations = async (
  locale: string,
  namespacesRequired?: string[] | undefined,
  configOverride?: UserConfig | null,
  extraLocales?: string[] | false,
) => serverSideTranslations(locale, namespacesRequired, nextI18NextConfig ?? configOverride, extraLocales);
