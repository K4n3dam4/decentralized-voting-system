import React from 'react';
import {
  Chart as ChartJS,
  Tooltip,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Legend,
  Colors,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Box, Flex, Stack, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Colors,
);

interface AdminOverviewProps {
  stats: AdminStats;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ stats }) => {
  const { t } = useTranslation();

  const color = useColorModeValue('#000', '#fff');
  const bgColor = useColorModeValue('#EDF2F6', '#171923');
  ChartJS.defaults.backgroundColor = bgColor;
  ChartJS.defaults.color = color;
  ChartJS.defaults.responsive = true;

  const defaultPlugins = {
    legend: {
      position: 'bottom' as const,
    },
  };

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

  const Charts = Object.entries(stats).map(([chart, data]) => {
    const options = {
      responsive: true,
      plugins: {
        ...defaultPlugins,
        title: {
          display: true,
        },
      },
    };

    switch (chart) {
      case 'all': {
        const opt: ChartOptions<'line'> = {
          ...options,
          scales: {
            x: {
              ticks: { color },
            },
            y: {
              ticks: { color },
            },
          },
        };
        opt.plugins.title.text = `Analytics ${new Date().getFullYear().toString()}`;
        const allData: ChartData<'line'> = {
          labels: months,
          datasets: data.dataSets,
        };

        return <Line options={options} data={allData} />;
      }
      case 'elections': {
        const opt: ChartOptions<'bar'> = { ...options };
        opt.plugins.title.text = `Elections`;
        const allData: ChartData<'bar'> = {
          labels: months,
          datasets: data.dataSets.map((set) => ({
            ...set,
            label: t(set.label),
          })),
        };

        return (
          <Box w="70%">
            <Bar options={opt} data={allData} />
          </Box>
        );
      }
      case 'latestElection': {
        const opt: ChartOptions<'doughnut'> = { ...options };
        opt.plugins.title.text = 'Latest election';
        const allData: ChartData<'doughnut'> = {
          labels: ['Eligible voters', 'Registered voters', 'Candidates'],
          datasets: data.dataSets,
        };

        return (
          <Box w="30%">
            <Doughnut options={opt} data={allData} />
          </Box>
        );
      }
    }
  });

  const ChartFull = Charts.shift();

  return (
    <Stack spacing={20}>
      <Flex alignItems="center">{Charts}</Flex>
      {ChartFull}
    </Stack>
  );
};

export default AdminOverview;
