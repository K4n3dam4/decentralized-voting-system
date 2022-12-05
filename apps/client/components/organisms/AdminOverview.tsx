import React from 'react';
import { Chart as ChartJS, Tooltip, Title, ArcElement, Legend, Colors, ChartData } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box, Stack, useColorModeValue } from '@chakra-ui/react';

ChartJS.register(ArcElement, Title, Tooltip, Legend, Colors);

interface AdminOverviewProps {
  elections: any[];
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ elections }) => {
  ChartJS.defaults.backgroundColor = useColorModeValue('#EDF2F6', '#171923');
  ChartJS.defaults.color = useColorModeValue('#000', '#fff');

  const pieData: ChartData<'pie'> = {
    datasets: [
      {
        data: [elections.length, 10],
      },
    ],
    labels: ['Elections', 'Users'],
  };

  return (
    <Box h="auto" w="full" m={10}>
      <Stack justifyContent="center" direction="row" w="100%" h="500px" spacing={10}>
        <Pie data={pieData} />
        <Pie data={pieData} />
      </Stack>
    </Box>
  );
};

export default AdminOverview;
