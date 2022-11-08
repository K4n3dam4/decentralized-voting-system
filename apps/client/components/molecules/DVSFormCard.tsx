import React, { useEffect, useState } from 'react';
import { Box, Heading, Stack, StackProps, Text } from '@chakra-ui/react';
import DVSInput, { DVSFormInputProps } from '../atoms/DVSFormInput';
import DVSButton, { DVSButtonProps } from '../atoms/DVSButton';
import { useTranslation } from 'next-i18next';

export interface DVSFormCardProps extends StackProps {
  heading: string;
  description?: string;
  inputs: DVSFormInputProps[];
  buttons: DVSButtonProps[];
  splitAtIndex?: number;
}

const DVSFormCard: React.FC<DVSFormCardProps> = ({
  heading,
  description,
  inputs,
  buttons,
  splitAtIndex,
  ...restProps
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();

  const handlePageChange = () => setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : currentIndex + 1);

  useEffect(() => {
    setCurrentIndex(0);
  }, [inputs.length]);

  const renderInputs = () => {
    const splitInputArray: [JSX.Element[], JSX.Element[]] = [[], []];
    if (splitAtIndex) {
      inputs.forEach((props, index) => {
        if (index < splitAtIndex) {
          if (props?.error && currentIndex > 0) setCurrentIndex(0);
          splitInputArray[0].push(<DVSInput key={`formcard-input-${index}`} {...props} />);
        } else {
          splitInputArray[1].push(<DVSInput key={`formcard-input-${index}`} {...props} />);
        }
      });
    } else {
      inputs.forEach((props, index) =>
        splitInputArray[0].push(<DVSInput key={`formcard-input-${index}`} {...props} />),
      );
    }
    return splitInputArray;
  };
  const renderButtons = () => {
    if (splitAtIndex) {
      const buttonArray: JSX.Element[] = [];
      if (currentIndex < 1) {
        buttonArray.push(
          <DVSButton onClick={handlePageChange} dvsType="secondary">
            {t('controls.continue')}
          </DVSButton>,
        );
      } else {
        buttonArray.push(
          <DVSButton onClick={handlePageChange} dvsType="secondary">
            {t('controls.back')}
          </DVSButton>,
        );
        buttons.forEach((props, index) => buttonArray.push(<DVSButton key={`formcard-btn-${index}`} {...props} />));
      }
      return buttonArray;
    }
    return buttons.map((props, index) => <DVSButton key={`formcard-btn-${index}`} {...props} />);
  };

  return (
    <Stack
      bg="gray.50"
      rounded="xl"
      p={{ base: 4, sm: 6, md: 8 }}
      height="fit-content"
      spacing={{ base: 8 }}
      maxW={{ lg: 'md' }}
      {...restProps}
    >
      <Stack spacing={4}>
        <Heading color="gray.800" lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
          {heading}
        </Heading>
        {description && (
          <Text color="gray.500" fontSize={{ base: 'sm', sm: 'md' }}>
            {description}
          </Text>
        )}
      </Stack>
      <Box as="form" mt={8}>
        <Stack spacing={4}>{renderInputs()[currentIndex]}</Stack>
        <Stack mt={6} spacing={4}>
          {renderButtons()}
        </Stack>
      </Box>
    </Stack>
  );
};

export default DVSFormCard;
