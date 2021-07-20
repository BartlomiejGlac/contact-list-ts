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
  const [error, setError] = useState<string | null>("");

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = () => {
    setisLoading(true);
    setError(null);
    receiveData()
      .then((dataBatch) => setData(data.concat(dataBatch)))
      .catch(() => {
        setError("Sorry, sommething went wrong, please try again");
      })
      .finally(() => {
        setisLoading(false);
      });
  };

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
        <button onClick={() => loadData()} className='App__button'>
          Load More
        </button>
      )}
      <div className='App__error-message'>{error}</div>
    </div>
  );
}

export default App;
