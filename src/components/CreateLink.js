import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

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
        <label htmlFor="create-link-description" className="f6 b db mb2">
          Description
        </label>

        <input
          id="create-link-description"
          className="input-reset ba b--black-20 pa2 mb2 db w-100"
          value={description}
          onChange={e => setDescription(e.target.value)}
          type="text"
          placeholder="A description for the link"
        />
        <label htmlFor="create-link-url" className="f6 b db mb2">
          Url
        </label>
        <input
          className="input-reset ba b--black-20 pa2 mb2 db w-100"
          id="create-link-url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          type="text"
          placeholder="The URL for the link"
        />
      </div>
      <Mutation mutation={POST_MUTATION} variables={{ description, url }} onCompleted={() => history.push("/")}>
        {postMutation => <button onClick={postMutation}>Submit</button>}
      </Mutation>
    </div>
  );
};
