import { useAtom } from 'jotai';
import { memosAtom, editMemoAtom, deleteMemoAtom } from '@/jotai/Jotai';

export const MemoList = () => {
  const [memos] = useAtom(memosAtom);

  const [, editMemo] = useAtom(editMemoAtom);

  const [, deleteMemo] = useAtom(deleteMemoAtom);

  // メモを削除
  const handleDelete = (id: number) => {
    deleteMemo(id);
  };

  // メモの編集
  const handleEdit =
    (id: number, key: 'value' | 'weight' | 'rep' | 'memo') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      editMemo(id, key, e.target.value);
    };

  return (
    <div>
      <ol>
        {memos.map((memo) => (
          <li key={memo.id}>
            <input
              type="text"
              value={memo.value}
              onChange={handleEdit(memo.id, 'value')}
              placeholder="種目名"
            />
            <span>×</span>
            {/** 重量を入力 */}
            <span>
              <input
                type="text"
                value={memo.weight}
                onChange={handleEdit(memo.id, 'weight')}
                placeholder="重量"
              />
            </span>

            <span>kg×</span>
            {/** レップ数を入力 */}
            <span>
              <input
                type="text"
                value={memo.rep}
                onChange={handleEdit(memo.id, 'rep')}
                placeholder="回数"
              />
            </span>
            <span>回</span>
            <span>
              <input
                type="text"
                value={memo.memo}
                onChange={handleEdit(memo.id, 'memo')}
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
