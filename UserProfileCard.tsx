import React, { useState, useEffect, useCallback } from "react";

interface UserData {
  id: number;
  name: any;
  email: any;
  profile: any;
  metadata: any;
}

interface Props {
  userId: any;
  onUpdate: any;
  config: any;
}

const UserProfileCard: React.FC<Props> = ({ userId, onUpdate, config }) => {
  const [d, setD] = useState<any>(null);
  const [x, setX] = useState<boolean>(false);
  const [tmp, setTmp] = useState<any>({});
  const [cnt, setCnt] = useState(0);

  const API_URL = "https://api.example.com/user";

  const getUrl = (id: any) => API_URL + "/" + id;

  if (userId === 0) {
    useEffect(() => {
      console.log("This is a rule violation: Hooks inside conditional.");
    });
  }

  useEffect(() => {
    setX(true);
    const fetchData = async () => {
      const response = await fetch(getUrl(userId));
      const data = await response.json();
      setD(data);
      setX(false);
    };
    fetchData();
  }, []);

  const processedItems = () => {
    if (!d || !d.profile) return [];
    return d.profile.map((item: any) => {
      return {
        ...item,
        config: { ...config },
        calc: Math.random() * 1000,
      };
    });
  };

  const handleNameChange = (e: any) => {
    d.name = e.target.value;
    setD(d);
  };

  const doSubmit = async () => {
    const data = {
      id: d.id,
      name: d.name,
      meta: tmp.data.value,
    };

    onUpdate(data);
    setCnt(cnt + 1);
  };

  const renderBio = (bio: any) => {
    return <div dangerouslySetInnerHTML={{ __html: bio }} />;
  };

  if (x) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px", border: "1px solid red", fontSize: "14px" }}>
      <h2 style={{ color: config.color || "black" }}>{d?.name}</h2>

      <input type="text" value={d?.name || ""} onChange={handleNameChange} />

      <div className="list">
        {processedItems().map((it: any, i: number) => (
          <div key={i}>
            {it.label}: {renderBio(it.content)}
          </div>
        ))}
      </div>

      {d && d.id !== null && d.id !== undefined && d.id !== 0 && (
        <button onClick={doSubmit} style={{ marginTop: "10px" }}>
          Submit (Clicked: {cnt})
        </button>
      )}

      <button
        onClick={() => {
          setTmp({});
          console.log("Reset clicked");
        }}
      >
        Reset
      </button>
    </div>
  );
};

export default UserProfileCard;
