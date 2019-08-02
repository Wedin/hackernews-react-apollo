import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Input from "./Input";
import { FEED_QUERY } from "../queries";

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

export default ({ history }) => {
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  return (
    <div>
      <div className="flex flex-column mt3">
        <Input
          value={description}
          onChange={e => setDescription(e.target.value)}
          label="Description"
          placeholder="A description for the link"
          id="create-link-description"
        />
        <Input
          value={url}
          onChange={e => setUrl(e.target.value)}
          label="Url"
          placeholder="The URL for the link"
          id="create-link-url"
        />
      </div>
      <Mutation
        mutation={POST_MUTATION}
        variables={{ description, url }}
        onCompleted={() => history.push("/")}
        update={(store, { data: { post } }) => {
          const data = store.readQuery({ query: FEED_QUERY });
          data.feed.links.unshift(post);
          store.writeQuery({
            query: FEED_QUERY,
            data,
          });
        }}
      >
        {postMutation => <button onClick={postMutation}>Submit</button>}
      </Mutation>
    </div>
  );
};
