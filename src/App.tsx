import React, { useCallback, useEffect, useState } from "react";
import apiData from "./api";
import PersonInfo from "./PersonInfo";

interface UserProfile {
  id: string;
  jobTitle: string;
  emailAddress: string;
  firstNameLastName: string;
}

function App({ receiveData = apiData }) {
  const [data, setData] = React.useState<UserProfile[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>("");
  //  TODO fetch contacts using apiData function, handle loading and error states
  useEffect(() => {
    setisLoading(true);
    setError(null);
    receiveData()
      .then((batch) => setData(data.concat(batch)))
      .catch(() => setError("Sorry, sommething went wrong, please try again"))
      .finally(() => {
        setisLoading(false);
      });
  }, [currentPage]);

  const handleCardClick = useCallback(
    (id: string) => {
      if (selected.includes(id)) {
        return setSelected(selected.filter((selectedId) => selectedId !== id));
      }
      setSelected([...selected, id]);
    },
    [selected]
  );

  const sortBySelected = (firstContact: UserProfile) => {
    if (selected.includes(firstContact.id)) {
      return -1;
    }
    return 1;
  };

  return (
    <div className='App'>
      <div className='selected'>Selected contacts: {selected.length}</div>
      {isLoading && <div>Loading...</div>}
      <div className='list'>
        {data.sort(sortBySelected).map((personInfo) => (
          // @ts-ignore
          <PersonInfo
            key={personInfo.id}
            data={personInfo}
            onClick={handleCardClick}
          />
        ))}
      </div>
      <button onClick={() => setCurrentPage(currentPage + 1)}>Load More</button>
      <div>{error}</div>
    </div>
  );
}

export default App;
