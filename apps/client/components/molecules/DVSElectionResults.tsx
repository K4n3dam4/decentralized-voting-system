import React from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'next-i18next';
import { useColorModeValue } from '@chakra-ui/react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export interface DVSElectionResultsProps {
  candidates: Candidate[];
}

const DVSElectionResults: React.FC<DVSElectionResultsProps> = ({ candidates }) => {
  const { t } = useTranslation();

  const color = useColorModeValue('#000', '#fff');
  const bgColor = useColorModeValue('#EDF2F6', '#171923');
  const gridColor = useColorModeValue('#A0AEC0', '#2D3748');
  ChartJS.defaults.backgroundColor = bgColor;
  ChartJS.defaults.color = color;
  ChartJS.defaults.responsive = true;

  const data: ChartData<'bar'> = {
    labels: candidates.map(({ name }) => name),
    datasets: [
      {
        label: 'Votes',
        data: candidates.map(({ voteCount }) => voteCount),
        backgroundColor: candidates.map(({ partyColor }) => partyColor),
        borderWidth: 1,
        barThickness: 200,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('election.results'),
      },
    },
    scales: {
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          stepSize: 1,
          color,
        },
      },
      x: {
        grid: {
          color: gridColor,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default DVSElectionResults;
