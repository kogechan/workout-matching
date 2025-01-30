import { useAtom } from 'jotai';
import { memosAtom } from '@/jotai/Jotai';

export const MemoList = () => {
  const [memos, setMemos] = useAtom(memosAtom);

  // メモを編集する関数
  const handleEdit = (
    id: number,
    key: 'date' | 'value' | 'weight' | 'rep' | 'memo' | 'category',
    value: string
  ) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.id === id ? { ...memo, [key]: value } : memo
      )
    );
  };

  // メモを削除する関数
  const handleDelete = (id: number) => {
    setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== id));
  };

  const handleChange =
    (id: number, key: 'value' | 'weight' | 'rep' | 'memo') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleEdit(id, key, e.target.value);
    };

  return (
    <div>
      <ol>
        {memos.map((memo) => (
          <li key={memo.id}>
            <input
              type="text"
              value={memo.value}
              onChange={handleChange(memo.id, 'value')}
              placeholder="種目名"
            />
            <span>×</span>
            {/** 重量を入力 */}
            <span>
              <input
                type="text"
                value={memo.weight}
                onChange={handleChange(memo.id, 'weight')}
                placeholder="重量"
              />
            </span>

            <span>kg×</span>
            {/** レップ数を入力 */}
            <span>
              <input
                type="text"
                value={memo.rep}
                onChange={handleChange(memo.id, 'rep')}
                placeholder="回数"
              />
            </span>
            <span>回</span>
            <span>
              <input
                type="text"
                value={memo.memo}
                onChange={handleChange(memo.id, 'memo')}
                placeholder="メモ"
              />
            </span>
            <button type="button" onClick={() => handleDelete(memo.id)}>
              削除
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};
