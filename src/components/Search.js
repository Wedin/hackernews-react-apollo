import React, { useState } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { FEED_SEARCH_QUERY } from "../queries";
import FeedLink from "./FeedLink";
import Input from "./Input";

const Search = () => {
  const [filter, setFilter] = useState("");
  const [doSearch, { loading, error, data }] = useLazyQuery(FEED_SEARCH_QUERY);
  const _executeSearch = () => doSearch({ variables: { filter } });
  const links = data && data.feed && data.feed.links;

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          _executeSearch();
        }}
        method="GET"
      >
        <div className="mv3">
          <Input id="search-input" value={filter} label="Search" onChange={e => setFilter(e.target.value)} />
          <button type="submit" onClick={() => _executeSearch()}>
            Search
          </button>
        </div>
      </form>
      <div className="mt3">
        {error && (
          <div className="pv3">
            Error
            <span role="img" aria-label="light">
              🚨
            </span>
          </div>
        )}
        {loading && <div className="pv3">Loading...</div>}
        {(links || []).map((link, index) => (
          <FeedLink key={link.id} link={link} index={index} />
        ))}
        {filter && filter.length > 0 && links && links.length === 0 && loading === false && <p>No Results</p>}
      </div>
    </div>
  );
};

export default Search;
