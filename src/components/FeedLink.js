import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { getAuthToken } from "../authTokenStorage";
import { timeDifferenceForDate, updateStoreAfterVote, getFeedLinkQueryVariables } from "../utils";

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const Link = ({ index, link, location, match }) => {
  const authToken = getAuthToken();
  const [addVote] = useMutation(VOTE_MUTATION, {
    update(
      store,
      {
        data: { vote },
      }
    ) {
      updateStoreAfterVote(store, vote, link.id, getFeedLinkQueryVariables(location, match));
    },
  });

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <div>
            <button
              className="ml1 gray f11 pointer button-reset pa1"
              onClick={e => {
                addVote({ variables: { linkId: link.id } });
              }}
              type="button"
              aria-label="Vote"
            >
              <span aria-hidden="true">▲</span>
            </button>
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        <div className="f6 lh-copy gray">
          {link.votes.length} votes | by {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;
