import { useEffect, useRef, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { MaterialSelect, UILanguage } from '@zoonk/models';
import { appLanguage, languageList } from '@zoonk/utils';
import useTranslation from './useTranslation';

interface LanguageFilterProps {
  active?: UILanguage;
  style?: React.CSSProperties;
}

const LanguageFilter = ({ active, style }: LanguageFilterProps) => {
  const translate = useTranslation();
  const [labelWidth, setLabelWidth] = useState(0);
  const inputLabel = useRef<HTMLLabelElement>(null);

  const handleChange = (event: React.ChangeEvent<MaterialSelect>) => {
    const language = event.target.value as UILanguage;

    /**
     * We have a specific sub-domain for every language. When a user
     * changes their language, we redirect to the appropriate address.
     */
    window.location.href = `https://${language}.zoonk.org`;
  };

  useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);

  return (
    <FormControl variant="outlined" style={{ width: '100%', ...style }}>
      <InputLabel ref={inputLabel} id="filter-language-label">
        {translate('choose_language')}
      </InputLabel>
      <Select
        labelId="filter-language-label"
        id="filter-language-select"
        value={active || appLanguage}
        onChange={handleChange}
        labelWidth={labelWidth}
      >
        {languageList.map((item) => (
          <MenuItem value={item.value} key={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageFilter;
