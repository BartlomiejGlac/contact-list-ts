import React, { useCallback } from "react";
import apiData from "./api";
import Loader from "./Loader";
import PersonInfo from "./PersonInfo";
import "./App.css";
import useDataFetcher from "./useDataFetcher";

interface UserProfile {
  id: string;
  jobTitle: string;
  emailAddress: string;
  firstNameLastName: string;
}

function App({ receiveData = apiData }) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [state, loadMore] = useDataFetcher<UserProfile>(receiveData, []);
  const { data, isLoading, isError } = state;

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

  const errorMessage = "Sorry, something went wrong, please try again";
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
        <button onClick={() => loadMore()} className='App__button'>
          Load More
        </button>
      )}
      {isError && <div className='App__error-message'>{errorMessage}</div>}
    </div>
  );
}

export default App;
