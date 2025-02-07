import { useAtom } from 'jotai';
import { memosAtom, dialogAtom } from '@/jotai/Jotai';

import { HistoryDialog } from './HistoryDialog';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import interactionPlugin from '@fullcalendar/interaction';

export const History = () => {
  const [memos] = useAtom(memosAtom);
  const [dialogOpen, setDialogOpen] = useAtom(dialogAtom);

  // カレンダーのイベントを作成
  const events = memos.map((memo) => ({
    id: memo.id.toString(),
    title: `${memo.value} (${memo.weight}kg × ${memo.rep})`,
    start: memo.date,
  }));

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locales={[jaLocale]}
        locale="ja"
        events={events}
        eventClick={() => {
          setDialogOpen(true);
        }}
      />
      {/* 詳細ダイアログ */}
      {dialogOpen && <HistoryDialog />}
    </div>
  );
};
