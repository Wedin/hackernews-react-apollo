import React from "react";
// Just rename this already
import Link from "./Link";
import { Link as ReactRouterLink } from "react-router-dom";
import { Query } from "react-apollo";
import { FEED_QUERY, NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from "../queries";
import { LINKS_PER_PAGE } from "../constants";

const LinkList = ({ location, match, history }) => {
  const _updateCacheAfterVote = (store, createVote, linkId) => {
    const { first, skip, orderBy } = _getQueryVariables();
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy },
    });

    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;
    store.writeQuery({ query: FEED_QUERY, data });
  };

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

  const _getQueryVariables = () => {
    const isNewPage = location.pathname.includes("new");
    const page = parseInt(match.params.page, 10);

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? "createdAt_DESC" : null;
    return { first, skip, orderBy };
  };

  const _getLinksToRender = data => {
    const isNewPage = location.pathname.includes("new");
    if (isNewPage) {
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

  return (
    <Query query={FEED_QUERY} variables={_getQueryVariables()}>
      {({ data, loading, error, subscribeToMore }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error</div>;

        _subscribeToNewLinks(subscribeToMore);
        _subscribeToNewVotes(subscribeToMore);

        const linksToRender = _getLinksToRender(data);
        const isNewPage = location.pathname.includes("new");
        const pageIndex = match.params.page ? (match.params.page - 1) * LINKS_PER_PAGE : 0;

        return (
          <div>
            {linksToRender.map((link, index) => (
              <Link key={link.id} link={link} index={index + pageIndex} updateStoreAfterVote={_updateCacheAfterVote} />
            ))}

            {isNewPage && (
              <div className="flex ml4 mv3 gray">
                <ReactRouterLink className="mr3" to={_getPreviousPageUrl()}>
                  Previous
                </ReactRouterLink>
                <ReactRouterLink to={_getNextPageUrl(data)}>Next</ReactRouterLink>
              </div>
            )}
          </div>
        );
      }}
    </Query>
  );
};

export default LinkList;
