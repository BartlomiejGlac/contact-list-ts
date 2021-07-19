import React, { useEffect } from "react";
import apiData from "./api";
import PersonInfo from "./PersonInfo";

interface UserProfile {
  id: string;
  jobTitle: string;
  emailAddress: string;
  firstNameLastName: string;
}

function App() {
  const [data, setData] = React.useState<UserProfile[]>([]);
  const [selected, setSelected] = React.useState([]);

  //  TODO fetch contacts using apiData function, handle loading and error states
  useEffect(() => {
    apiData()
      .then((batch) => setData(data.concat(batch)))
      .finally(() => {});
  }, []);

  return (
    <div className='App'>
      <div className='selected'>Selected contacts: {selected.length}</div>
      <div className='list'>
        {data.map((personInfo) => (
          // @ts-ignore
          <PersonInfo key={personInfo.id} data={personInfo} />
        ))}
      </div>
    </div>
  );
}

export default App;
