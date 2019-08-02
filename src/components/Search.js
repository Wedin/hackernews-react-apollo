import React, { useState } from "react";
import { withApollo } from "react-apollo";
import { FEED_SEARCH_QUERY } from "../queries";
import Link from "./Link";
import Input from "./Input";

const Search = ({ client }) => {
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const _executeSearch = async () => {
    const result = await client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    });
    setLinks(result.data.feed.links);
    setHasSearched(true);
  };

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
          <button onClick={() => _executeSearch()}>Search</button>
        </div>
      </form>
      <div className="mt3">
        {links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
        {hasSearched && links.length === 0 && <p>No Results</p>}
      </div>
    </div>
  );
};

export default withApollo(Search);
