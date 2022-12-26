import React from 'react';
import { ChromePicker } from 'react-color';
import { Popover, Button, PopoverTrigger, PopoverContent, useColorModeValue } from '@chakra-ui/react';

export interface DVSColorPickerProps {
  color: string;
  onChange: (event: any) => void;
  children: string;
  name?: string;
}

const DVSColorPicker: React.FC<DVSColorPickerProps> = ({ color, children, onChange, name }) => {
  const hexToRGB = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const getHighContrastColor = (hex: string) => {
    const color = hexToRGB(hex);
    const yiq = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#ffffff';
  };

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button color={getHighContrastColor(color ?? '#fffff')} style={{ backgroundColor: color }}>
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        overflow="hidden"
        maxW="220px"
        sx={{
          '& input': {
            color: `${useColorModeValue('#000', '#EDEDEE')} !important`,
            backgroundColor: useColorModeValue('#EDF2F6', '#171923'),
          },
        }}
      >
        <ChromePicker
          style={{ width: '100%' }}
          color={color}
          onChange={(color, event) => onChange({ ...event, target: { ...event.target, name, value: color.hex } })}
          disableAlpha
        />
      </PopoverContent>
    </Popover>
  );
};

export default DVSColorPicker;
