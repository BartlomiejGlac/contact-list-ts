import classNames from "classnames";
import React, { useCallback } from "react";

import "./PersonInfo.css";
type Props = {
  data: {
    firstNameLastName: string;
    jobTitle: string;
    emailAddress: string;
    id: string;
  };
  onClick: (id: string) => void;
  selected: boolean;
};

function PersonInfo(props: Props) {
  const { data, onClick, selected } = props;
  const { firstNameLastName, jobTitle, emailAddress, id } = data;
  const handleClick = useCallback(() => {
    onClick(id);
  }, [id, onClick]);

  return (
    <div
      className={classNames("person-info", {
        "person-info--selected": selected,
      })}
      data-testid='person-info'
      onClick={handleClick}
    >
      <div className='person-info__firstNameLastName'>{firstNameLastName}</div>
      <div className='person-info__jobTitle'>{jobTitle}</div>
      <div className='person-info__emailAddress'>{emailAddress}</div>
    </div>
  );
}

export default React.memo(PersonInfo);
