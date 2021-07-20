import React, { useCallback, useEffect, useState } from "react";
import apiData from "./api";
import Loader from "./Loader";
import PersonInfo from "./PersonInfo";
import "./App.css";
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

  useEffect(() => {
    setisLoading(true);
    setError(null);
    receiveData()
      .then((batch) => setData(data.concat(batch)))
      .catch(() => setError("Sorry, sommething went wrong, please try again"))
      .finally(() => {
        setisLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, receiveData]);

  const handleCardClick = useCallback(
    (id: string) => {
      if (selected.includes(id)) {
        return setSelected(selected.filter((selectedId) => selectedId !== id));
      }
      setSelected([...selected, id]);
    },
    [selected]
  );

  const sortBySelected = (
    firstContact: UserProfile,
    secondContact: UserProfile
  ) => {
    if (selected.includes(firstContact.id)) return -1;
    if (selected.includes(secondContact.id)) return 1;
    return Number(firstContact.id) - Number(secondContact.id);
  };

  return (
    <div className='App'>
      <div className='App__selected'>Selected contacts: {selected.length}</div>
      <div className='App__list'>
        {data.sort(sortBySelected).map((personInfo) => (
          <PersonInfo
            key={personInfo.id}
            data={personInfo}
            onClick={handleCardClick}
            selected={selected.includes(personInfo.id)}
          />
        ))}
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className='App__button'
        >
          Load More
        </button>
      )}
      <div>{error}</div>
    </div>
  );
}

export default App;
