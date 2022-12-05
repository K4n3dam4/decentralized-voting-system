import React from 'react';
import {
  Chart as ChartJS,
  Tooltip,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Colors,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Stack, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Colors);

interface AdminOverviewProps {
  elections: any[];
  users: any[];
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ elections, users }) => {
  const { t } = useTranslation();

  const color = useColorModeValue('#000', '#fff');
  const bgColor = useColorModeValue('#EDF2F6', '#171923');
  const borderColorPrimary = useColorModeValue('#CB1871', '#F38DBF');
  ChartJS.defaults.backgroundColor = bgColor;
  ChartJS.defaults.color = color;

  const months = [
    t('dates.months.jan'),
    t('dates.months.feb'),
    t('dates.months.mar'),
    t('dates.months.apr'),
    t('dates.months.may'),
    t('dates.months.jun'),
    t('dates.months.jul'),
    t('dates.months.aug'),
    t('dates.months.sep'),
    t('dates.months.oct'),
    t('dates.months.nov'),
    t('dates.months.dec'),
  ];

  const analyticsOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: `Analytics ${new Date().getFullYear().toString()}`,
      },
    },
    scales: {
      x: {
        ticks: { color },
      },
      y: {
        ticks: { color },
      },
    },
  };
  const analyticsData: ChartData<'line'> = {
    labels: months,
    datasets: [
      {
        label: 'Elections',
        data: months.map((_month, index) => {
          const created = elections.filter((election) => {
            const electionDate = new Date(election.createdAt);
            const electionMonth = electionDate.getMonth();
            const electionYear = electionDate.getFullYear();
            const year = new Date().getFullYear();

            if (electionYear === year && electionMonth === index) return election;
          });

          return created.length;
        }),
        borderColor: borderColorPrimary,
      },
      {
        label: 'Users',
        data: months.map((_month, index) => {
          const created = users.filter((user) => {
            const createdAt = new Date(user.createdAt);
            const month = createdAt.getMonth();
            const year = createdAt.getFullYear();
            const currentYear = new Date().getFullYear();

            if (year === currentYear && month === index) return user;
          });

          return created.length;
        }),
        borderColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  return (
    <Stack spacing={20}>
      <Box display="flex" justifyContent="center" w="100%" h="500px">
        <Line options={analyticsOptions} data={analyticsData} />
      </Box>
    </Stack>
  );
};

export default AdminOverview;
