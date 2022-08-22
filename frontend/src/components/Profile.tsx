import React from "react";

import { getCurrentUser } from "../services/auth.service";

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();

  return (
    <div className="container">
      <div className="card card-container">
        <div className="form-group">
          <label>Email:</label>
          <input
            defaultValue={currentUser.user.email.toUpperCase()}
            className="form-control"
            disabled
          />
        </div>
        <div className="form-group">
          <label>User ID:</label>
          <input
            defaultValue={currentUser.user._id}
            className="form-control"
            disabled
          />
        </div>
        <div className="form-group">
          <label>Joined:</label>
          <input
            defaultValue={currentUser.user.createdAt}
            className="form-control"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
