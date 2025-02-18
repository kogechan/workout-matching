import { useAtom } from 'jotai';
import { logoutModalAtom } from '@/jotai/Jotai';
import { Dialog } from '@mui/material';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';

export const LogoutAlert = () => {
  const [logoutModalOpen, setLogoutModalOpen] = useAtom(logoutModalAtom);

  const router = useRouter();

  const Logout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) {
        throw logoutError;
      }
    } catch {
      alert('エラーが発生しました');
    }
  };
  return (
    <Dialog open={logoutModalOpen} onClose={() => setLogoutModalOpen(false)}>
      <h1>本当にログアウトしますか？</h1>
      <div>
        <button
          onClick={(e) => {
            Logout(e);
            setLogoutModalOpen(false);
            router.push('/');
          }}
        >
          ログアウト
        </button>
      </div>
    </Dialog>
  );
};
