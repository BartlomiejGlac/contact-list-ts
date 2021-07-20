import React, { useCallback } from "react";

type Props = {
  data: {
    firstNameLastName: string;
    jobTitle: string;
    emailAddress: string;
    id: string;
  };
  onClick: (id: string) => void;
};

function PersonInfo(props: Props) {
  const { data, onClick } = props;
  const { firstNameLastName, jobTitle, emailAddress, id } = data;
  const handleClick = useCallback(() => {
    onClick(id);
  }, [id, onClick]);

  return (
    <div
      style={{
        display: "flex",
        height: "100px",
        justifyContent: "center",
        flexDirection: "column",
        padding: "32px",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.15)",
        margin: "10px 0",
        background: "#fff",
        cursor: "pointer",
      }}
      className='person-info'
      data-testid='person-info'
      onClick={handleClick}
    >
      <div className='firstNameLastName'>{firstNameLastName}</div>
      <div className='jobTitle'>{jobTitle}</div>
      <div className='emailAddress'>{emailAddress}</div>
    </div>
  );
}

export default PersonInfo;
