import React, { useEffect, useState, useCallback } from 'react';
import { getProfile } from '../api';
import { CgProfile } from "react-icons/cg";

const ProfileInfo = () => {
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [username, setUsername] = useState('Username');
  const [email, setEmail] = useState('user@example.com');

  const getuserprofile = useCallback(async () => {
    const user =  await getProfile();
    setUsername(user.name);
    setEmail(user.email);
  },[]);

  useEffect( () => {
     getuserprofile();
  }, [getuserprofile]);

  return (
    <div className="profile-section">
    <div 
      className="profile-icon"
      onMouseEnter={() => setShowProfileInfo(true)}
      onMouseLeave={() => setShowProfileInfo(false)}
    >
      {/* Replace with your own profile image or icon */}
      <CgProfile className="profile-image" />
    </div>
    {showProfileInfo && (
      <div className="profile-info">
        <p><strong>{username}</strong></p>
        <p>{email}</p>
      </div>
    )}
    </div>
  );
};

export default ProfileInfo;
