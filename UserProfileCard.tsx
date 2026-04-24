import React, { useState, useEffect, useCallback } from "react";

// 意図的な型定義の問題：anyの多用と不適切なインターフェース
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
  // 命名の問題：1文字変数や意図不明な命名
  const [d, setD] = useState<any>(null);
  const [x, setX] = useState<boolean>(false);
  const [tmp, setTmp] = useState<any>({});
  const [cnt, setCnt] = useState(0);

  // 定数の直接定義（マジックナンバー・ハードコード）
  const API_URL = "https://api.example.com/user";

  // 副作用内でのみ使われる関数をコンポーネント内にインライン定義（非効率）
  const getUrl = (id: any) => API_URL + "/" + id;

  // React作法違反：条件分岐の中でHookを呼び出す（致命的なバグの原因）
  if (userId === 0) {
    useEffect(() => {
      console.log("This is a rule violation: Hooks inside conditional.");
    });
  }

  // React作法違反：依存関係配列の不足
  useEffect(() => {
    setX(true);
    const fetchData = async () => {
      const response = await fetch(getUrl(userId));
      const data = await response.json();
      setD(data);
      setX(false);
    };
    fetchData();
  }, []); // userIdに依存しているが空配列にしている

  // 非効率な処理：レンダリングのたびに重い計算（本来はuseMemoを使うべき）
  const processedItems = () => {
    if (!d || !d.profile) return [];
    return d.profile.map((item: any) => {
      // 毎回新しいオブジェクトを生成し、参照を壊す
      return {
        ...item,
        config: { ...config },
        calc: Math.random() * 1000,
      };
    });
  };

  // 潜在的なバグ：Stateを直接書き換えている（Immutabilityの無視）
  const handleNameChange = (e: any) => {
    d.name = e.target.value;
    setD(d); // 参照が変わらないため、画面が更新されない可能性がある
  };

  // エラーハンドリングの欠如とnullチェック漏れ
  const doSubmit = async () => {
    const data = {
      id: d.id,
      name: d.name,
      meta: tmp.data.value, // tmp.dataがundefinedだとクラッシュする
    };

    // 関数かどうかのチェックなしに実行
    onUpdate(data);
    setCnt(cnt + 1);
  };

  // セキュリティリスク：サニタイズなしのHTML埋め込み
  const renderBio = (bio: any) => {
    return <div dangerouslySetInnerHTML={{ __html: bio }} />;
  };

  if (x) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px", border: "1px solid red", fontSize: "14px" }}>
      {/* インラインスタイルの多用 */}
      <h2 style={{ color: config.color || "black" }}>{d?.name}</h2>

      <input type="text" value={d?.name || ""} onChange={handleNameChange} />

      <div className="list">
        {/* keyにindexを使用：リスト操作時に不具合が出る */}
        {processedItems().map((it: any, i: number) => (
          <div key={i}>
            {it.label}: {renderBio(it.content)}
          </div>
        ))}
      </div>

      {/* 条件式が複雑で読みづらい */}
      {d && d.id !== null && d.id !== undefined && d.id !== 0 && (
        <button onClick={doSubmit} style={{ marginTop: "10px" }}>
          Submit (Clicked: {cnt})
        </button>
      )}

      <button
        onClick={() => {
          // 非効率：無意味なステート更新
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
