import { AddMemo } from '@/components/AddMemo';
import { MemoList } from '@/components/MemoList';
import { CategoryList } from '@/components/Category';

const Home = () => {
  return (
    <div>
      <AddMemo />
      <MemoList />
      <CategoryList />
    </div>
  );
};

export default Home;
