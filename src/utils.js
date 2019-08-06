import { FEED_QUERY } from './queries';
import { LINKS_PER_PAGE } from './constants';

function timeDifference(current, previous) {
  const milliSecondsPerMinute = 60 * 1000;
  const milliSecondsPerHour = milliSecondsPerMinute * 60;
  const milliSecondsPerDay = milliSecondsPerHour * 24;
  const milliSecondsPerMonth = milliSecondsPerDay * 30;
  const milliSecondsPerYear = milliSecondsPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < milliSecondsPerMinute / 3) {
    return "just now";
  }

  if (elapsed < milliSecondsPerMinute) {
    return "less than 1 min ago";
  } else if (elapsed < milliSecondsPerHour) {
    return Math.round(elapsed / milliSecondsPerMinute) + " min ago";
  } else if (elapsed < milliSecondsPerDay) {
    return Math.round(elapsed / milliSecondsPerHour) + " h ago";
  } else if (elapsed < milliSecondsPerMonth) {
    return Math.round(elapsed / milliSecondsPerDay) + " days ago";
  } else if (elapsed < milliSecondsPerYear) {
    return Math.round(elapsed / milliSecondsPerMonth) + " mo ago";
  } else {
    return Math.round(elapsed / milliSecondsPerYear) + " years ago";
  }
}

export function timeDifferenceForDate(date) {
  const now = new Date().getTime();
  const updated = new Date(date).getTime();
  return timeDifference(now, updated);
}

export function getFeedLinkQueryVariables(location, match) {
  const isNewPage = location.pathname.includes("new")
  const page = parseInt(match.params.page, 10);

  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const first = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = isNewPage ? "createdAt_DESC" : null;
  return { first, skip, orderBy };
};


export function updateStoreAfterVote(store, createVote, linkId, queryVariables) {
  const { first, skip, orderBy } = queryVariables;
  const data = store.readQuery({
    query: FEED_QUERY,
    variables: { first, skip, orderBy },
  });

  const votedLink = data.feed.links.find(link => link.id === linkId);
  votedLink.votes = createVote.link.votes;
  store.writeQuery({ query: FEED_QUERY, data });
}