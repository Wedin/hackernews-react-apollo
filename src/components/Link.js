import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { getAuthToken } from "../AuthTokenStorage";
import { timeDifferenceForDate } from "../utils";

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

const Link = ({ index, link, updateStoreAfterVote }) => {
  const authToken = getAuthToken();

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{ linkId: link.id }}
            update={(store, { data: { vote } }) => updateStoreAfterVote(store, vote, link.id)}
          >
            {voteMutation => (
              <button
                className="ml1 gray f11 pointer button-reset pa1"
                onClick={voteMutation}
                type="button"
                aria-label="Vote"
              >
                <span aria-hidden="true">▲</span>
              </button>
            )}
          </Mutation>
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
