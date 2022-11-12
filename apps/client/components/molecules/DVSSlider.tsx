import React from 'react';
import Carousel, { CarouselProps } from 'nuka-carousel';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';

const DVSSlider: React.FC<CarouselProps> = ({ children, ...restProps }) => {
  return (
    <Carousel
      renderCenterLeftControls={({ previousDisabled, previousSlide }) => (
        <Button
          display={{ base: 'none', md: 'inherit' }}
          variant="ghost"
          colorScheme="brand"
          onClick={previousSlide}
          disabled={previousDisabled}
          ml={2}
        >
          <ArrowLeftIcon height={5} width={10} />
        </Button>
      )}
      renderCenterRightControls={({ nextDisabled, nextSlide }) => (
        <Button
          display={{ base: 'none', md: 'inherit' }}
          variant="ghost"
          colorScheme="brand"
          onClick={nextSlide}
          disabled={nextDisabled}
          mr={2}
        >
          <ArrowRightIcon height={5} width={10} />
        </Button>
      )}
      renderBottomCenterControls={null}
      className="election-slider"
      slidesToShow={1}
      wrapAround
      {...restProps}
    >
      {children}
    </Carousel>
  );
};

export default DVSSlider;
