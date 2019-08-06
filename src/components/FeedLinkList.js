import React from "react";
import FeedLink from "./FeedLink";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { FEED_QUERY, NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from "../queries";
import { LINKS_PER_PAGE } from "../constants";
import { getFeedLinkQueryVariables } from "../utils";

const IsNewPage = location => location.pathname.includes("new");

const FeedLinkList = ({ location, match, history }) => {
  const _subscribeToNewLinks = async subscribeToMore => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newLink = subscriptionData.data.newLink;
        const exists = prev.feed.links.find(({ id }) => id === newLink.id);
        if (exists) return prev;

        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename,
          },
        });
      },
    });
  };

  const _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION,
    });
  };

  const _getLinksToRender = data => {
    if (IsNewPage(location)) {
      return data.feed.links;
    }
    const rankedLinks = data.feed.links.slice();
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
    return rankedLinks;
  };

  const _getNextPageUrl = data => {
    const page = parseInt(match.params.page, 10);
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      return `/new/${nextPage}`;
    }
    return `/new/${page}`;
  };

  const _getPreviousPageUrl = () => {
    const page = parseInt(match.params.page, 10);
    if (page > 1) {
      const previousPage = page - 1;
      return `/new/${previousPage}`;
    }
    return `/new/${page}`;
  };

  const { data, loading, error, subscribeToMore } = useQuery(FEED_QUERY, {
    variables: getFeedLinkQueryVariables(location, match),
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  _subscribeToNewLinks(subscribeToMore);
  _subscribeToNewVotes(subscribeToMore);

  const linksToRender = _getLinksToRender(data);
  const isNewPage = IsNewPage(location);
  const pageIndex = match.params.page ? (match.params.page - 1) * LINKS_PER_PAGE : 0;

  return (
    <div>
      {linksToRender.map((link, index) => (
        <FeedLink key={link.id} link={link} index={index + pageIndex} />
      ))}

      {isNewPage && (
        <div className="flex ml4 mv3 gray">
          <Link className="mr3" to={_getPreviousPageUrl()}>
            Previous
          </Link>
          <Link to={_getNextPageUrl(data)}>Next</Link>
        </div>
      )}
    </div>
  );
};

export default FeedLinkList;
