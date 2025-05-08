import { Box, Typography, Avatar, Grid2 } from '@mui/material';
import { Person, People as PeopleIcon } from '@mui/icons-material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SectionTitle from './common/SectionTitle';

interface BenefitItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const benefitItems: BenefitItem[] = [
  {
    icon: <Person />,
    title: '簡単マッチング',
    description:
      'KINTAのコンセプトはマッチングサービスですが、多くの方々に誰でも平等に合トレができるようなシステムを提供しています。つまり、合トレしたい気になるユーザーがいれば簡単にメッセージを送ることができます。',
  },
  {
    icon: <PsychologyIcon />,
    title: '体とマインドの成長',
    description:
      '合トレをすることによって一人で筋トレしている時では得られない知識や経験、刺激を得ることができます。体だけなくマインドも共に成長させることが可能です。',
  },
  {
    icon: <PeopleIcon />,
    title: '新しい出会い',
    description:
      '筋トレや合トレのコミュニティなどは至る所に存在しています。KINTAを利用すればより多くのトレーニーや仲間と繋がることができ、新しい出会いや新たなコミュニティを築くことが可能です。',
  },
];

const Benefits = () => {
  return (
    <>
      <SectionTitle title="KINTAのメリット" />

      {/* デスクトップ表示 */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 10 }}>
        <Grid2 container spacing={4}>
          {benefitItems.map((item, index) => (
            <Grid2 size={{ xs: 12, md: 4 }} key={index}>
              <Box
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {item.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="body1">{item.description}</Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Box>

      {/* モバイル表示 - 横スクロール */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          mb: 10,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '40px',
            height: '100%',
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            pb: 2,
          }}
        >
          {benefitItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: '0 0 85%',
                scrollSnapAlign: 'center',
                p: 3,
                mr: 2,
                minWidth: '280px',
                maxWidth: '350px',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  {item.icon}
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  {item.title}
                </Typography>
              </Box>
              <Typography variant="body1">{item.description}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Benefits;
