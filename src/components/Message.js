import React from "react";

export const Message = ({ from, message }) => (
  <div className="notif">
    <h4>{from}</h4>
    <li>{message}</li>
  </div>
);

Message.displayName = "Message";
