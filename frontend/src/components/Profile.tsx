import React from "react";

import { getCurrentUser } from "../services/auth.service";

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.user.email}</strong> Profile
        </h3>
      </header>
      <p className="border-bottom pb-1">
        <strong>Token:</strong> {currentUser.token.substring(0, 20)} ...{" "}
        {currentUser.token.substr(currentUser.token.length - 20)}
      </p>
      <p className="border-bottom pb-1">
        <strong>Id:</strong> {currentUser.user._id}
      </p>
      <p className="border-bottom pb-1">
        <strong>Joined:</strong> {currentUser.user.createdAt}
      </p>
    </div>
  );
};

export default Profile;
