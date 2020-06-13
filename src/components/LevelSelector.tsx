import { useEffect, useRef, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { ExpertLevel, MaterialSelect } from '@zoonk/models';
import useTranslation from './useTranslation';

interface LevelSelectorProps {
  active: ExpertLevel;
  style?: React.CSSProperties;
  onSelect: (level: ExpertLevel) => void;
}

const LevelSelector = ({ active, style, onSelect }: LevelSelectorProps) => {
  const translate = useTranslation();
  const [labelWidth, setLabelWidth] = useState(0);
  const inputLabel = useRef<HTMLLabelElement>(null);
  const levels = [
    { name: translate('beginner'), value: 'beginner' },
    { name: translate('advanced'), value: 'advanced' },
    { name: translate('pro'), value: 'pro' },
    { name: translate('expert'), value: 'expert' },
  ];

  const handleChange = (event: React.ChangeEvent<MaterialSelect>) => {
    onSelect(event.target.value as ExpertLevel);
  };

  useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);

  return (
    <FormControl variant="outlined" style={{ width: '100%', ...style }}>
      <InputLabel ref={inputLabel} id="level-label">
        {translate('level')}
      </InputLabel>
      <Select
        labelId="level-label"
        id="level-select"
        value={active}
        onChange={handleChange}
        labelWidth={labelWidth}
      >
        {levels.map((item) => (
          <MenuItem value={item.value} key={item.value}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LevelSelector;
