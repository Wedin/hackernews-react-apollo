import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Input from "./Input";
import { FEED_QUERY } from "../queries";
import { LINKS_PER_PAGE } from "../constants";

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
  const [addPost, { loading, error }] = useMutation(POST_MUTATION, {
    update(
      store,
      {
        data: { post },
      }
    ) {
      const first = LINKS_PER_PAGE;
      const skip = 0;
      const orderBy = "createdAt_DESC";
      const data = store.readQuery({
        query: FEED_QUERY,
        variables: { first, skip, orderBy },
      });
      data.feed.links.unshift(post);
      store.writeQuery({
        query: FEED_QUERY,
        data,
        variables: { first, skip, orderBy },
      });
    },
    onCompleted() {
      history.push("/new/1");
    },
  });

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
      <>
        {loading && <p>Loading...</p>}
        {error && <p>Error!</p>}
        <button onClick={e => addPost({ variables: { description, url } })}>Submit</button>
      </>
    </div>
  );
};
