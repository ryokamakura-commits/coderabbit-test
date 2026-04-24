import React, { useState, useEffect } from "react";

// 意図的な型定義の問題：anyの多用
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
  // 命名の問題：意図が不明確な変数名
  const [d, setD] = useState<any>(null);
  const [x, setX] = useState<boolean>(false);
  const [tmp, setTmp] = useState<any>({});
  const [refreshCounter, setRefreshCounter] = useState(0);

  // 命名の問題：何をしているのか不明確
  const foo = "https://api.example.com/user";
  const bar = (id: any) => `${foo}/${id}`;
  const baz = async (endpoint: any) => {
    const res = await fetch(endpoint);
    return res.json();
  };

  // React作法違反：依存関係配列が不足している
  useEffect(() => {
    setX(true);
    const url = bar(userId);
    baz(url).then((userData: any) => {
      setD(userData);
      setX(false);
    });
  }, []); // 本来はuserId, barが依存関係に必要

  // 非効率な処理：不要な再レンダリングが発生
  const processData = () => {
    const processedData = d?.profile?.map((item: any) => {
      return {
        ...item,
        // 毎回新しいオブジェクトを作成してしまう
        config: { ...config },
        timestamp: new Date().toISOString(),
        randomValue: Math.random(),
      };
    });
    return processedData;
  };

  // 命名の問題：aはeventを意味するのか不明確
  const handleNameChange = (a: any) => {
    // nullチェック漏れ：dはnullの可能性がある
    d.name = a.target.value;
    setD(d); // オブジェクト参照が変わらないため再レンダリングされない問題
  };

  // 潜在的なバグ：初期値の設定ミス、nullチェック漏れ
  const submitForm = async () => {
    // nullチェックがない
    const payload = {
      id: d.id,
      name: d.name,
      email: d.email,
      // profileは未定義の可能性がある
      profile: d.profile,
      // metadataはanyなので予測不可能
      updatedMetadata: tmp.data,
    };

    try {
      // onUpdateはnullまたは関数でない可能性がある
      onUpdate(payload);
      setRefreshCounter(refreshCounter + 1);
    } catch (e) {
      // エラーハンドリングがない
      console.log(e);
    }
  };

  // 非効率な処理：毎回配列全体を処理している
  const renderProfileItems = () => {
    return processData()?.map((item: any, idx: any) => (
      <div key={idx}>
        {/* keyにindexを使用：リスト順序変更時にバグが生じる */}
        <span>{item.name}</span>
        <span>{item.value}</span>
      </div>
    ));
  };

  // React作法違反：依存関係配列なし
  useEffect(() => {
    // 副作用なしにuseEffectを使用
    console.log("rendered");
  }); // 毎回レンダリング時に実行される

  // 命名の問題：y, z, resの意味が不明確
  const y = d?.name || "";
  const z = d?.email || undefined;
  const res = x;

  if (res) {
    return <div>ロード中...</div>;
  }

  return (
    <div className="profile-card">
      <h2>{y}</h2>
      <input value={y} onChange={handleNameChange} placeholder="名前を入力" />
      <p>メール: {z}</p>

      {/* 潜在的なバグ：configはanyなので存在確認がない */}
      <div className="config-info">{config.theme || "デフォルト"}</div>

      {/* nullチェック漏れ：dがnullの場合 */}
      <div className="profile-details">{renderProfileItems()}</div>

      <button onClick={submitForm}>保存</button>

      {/* 命名の問題：btn_refのような古い命名規則 */}
      <button
        onClick={() => {
          // 非効率：ステート更新のみでリセット処理がない
          setTmp({});
          setRefreshCounter(refreshCounter + 1);
        }}
      >
        リセット
      </button>
    </div>
  );
};

export default UserProfileCard;
