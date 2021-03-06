import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import {
  TvResult,
  MovieResult,
  PersonResult,
} from '../../../server/models/Search';
import { useSWRInfinite } from 'swr';
import ListView from '../Common/ListView';
import { LanguageContext } from '../../context/LanguageContext';
import { defineMessages, useIntl } from 'react-intl';
import Header from '../Common/Header';
import globalMessages from '../../i18n/globalMessages';

const messages = defineMessages({
  searchresults: 'Search Results',
});

interface SearchResult {
  page: number;
  totalResults: number;
  totalPages: number;
  results: (MovieResult | TvResult | PersonResult)[];
}

const Search: React.FC = () => {
  const intl = useIntl();
  const { locale } = useContext(LanguageContext);
  const router = useRouter();
  const { data, error, size, setSize } = useSWRInfinite<SearchResult>(
    (pageIndex: number, previousPageData: SearchResult | null) => {
      if (previousPageData && pageIndex + 1 > previousPageData.totalPages) {
        return null;
      }

      return `/api/v1/search/?query=${router.query.query}&page=${
        pageIndex + 1
      }&language=${locale}`;
    },
    {
      initialSize: 3,
    }
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');

  const fetchMore = () => {
    setSize(size + 1);
  };

  if (error) {
    return <div>{error}</div>;
  }

  const titles = data?.reduce(
    (a, v) => [...a, ...v.results],
    [] as (MovieResult | TvResult | PersonResult)[]
  );

  const isEmpty = !isLoadingInitialData && titles?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.results.length < 20);

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-6 sm:mb-0 mt-6">
        <Header>{intl.formatMessage(messages.searchresults)}</Header>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <span className="relative z-0 inline-flex shadow-sm rounded-md">
            <button
              type="button"
              className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-indigo-900 bg-indigo-500 hover:bg-indigo-400 text-sm leading-5 font-medium text-gray-100 hover:text-white focus:z-10 focus:outline-none focus:border-blue-300 focus:ring-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
            >
              {intl.formatMessage(globalMessages.movies)}
            </button>
            <button
              type="button"
              className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-indigo-900 bg-indigo-500   text-sm leading-5 font-medium text-gray-100 hover:text-white focus:z-10 focus:outline-none focus:border-blue-300 focus:ring-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
            >
              {intl.formatMessage(globalMessages.tvshows)}
            </button>
          </span>
        </div>
      </div>
      <ListView
        items={titles}
        isEmpty={isEmpty}
        isLoading={
          isLoadingInitialData || (isLoadingMore && (titles?.length ?? 0) > 0)
        }
        isReachingEnd={isReachingEnd}
        onScrollBottom={fetchMore}
      />
    </>
  );
};

export default Search;
