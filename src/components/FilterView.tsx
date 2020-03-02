import { Apps, List } from '@material-ui/icons';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { ViewType } from '@zoonk/models';

interface FilterViewProps {
  view: ViewType;
  onChange: (view: ViewType) => void;
}

const FilterView = ({ view, onChange }: FilterViewProps) => {
  return (
    <ToggleButtonGroup
      value={view}
      onChange={(_, value) => onChange(value)}
      exclusive
      aria-label="view filter"
      style={{ margin: 0 }}
    >
      <ToggleButton value="grid" aria-label="grid">
        <Apps />
      </ToggleButton>
      <ToggleButton value="list" aria-label="list">
        <List />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default FilterView;
