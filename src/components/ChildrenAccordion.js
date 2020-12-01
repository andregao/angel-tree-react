import React, { useEffect, useState } from 'react';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';
import { DataGrid } from '@material-ui/data-grid';
import Accordion from '@material-ui/core/Accordion';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

const ChildrenAccordion = ({
  rows,
  columns,
  setRefresh,
  isLoading,
  handleAddChild,
}) => {
  const [filter, setFilter] = useState('');
  const handleChange = ({ target: { value } }) => setFilter(value);
  const [filteredRows, setFilteredRows] = useState(rows);
  useEffect(() => {
    const result = rows.filter(item => {
      return item.name.toLowerCase().includes(filter.toLowerCase());
    });
    setFilteredRows(result);
  }, [filter, rows]);
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id='children-expansion'>
        <Typography variant='h6'>Child List</Typography>
      </AccordionSummary>
      <AccordionActions>
        <TextField
          label='Filter by Name'
          variant='outlined'
          name={'childFilter'}
          onChange={handleChange}
          value={filter}
        />
        <ButtonGroup>
          <Button
            size='small'
            startIcon={<CachedIcon />}
            variant='outlined'
            color='primary'
            onClick={() => setRefresh(true)}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            color='primary'
            size='small'
            variant='contained'
            onClick={handleAddChild}
          >
            Add child
          </Button>
        </ButtonGroup>
      </AccordionActions>
      <div style={{ height: 660, width: '100%' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={10}
          autoHeight
          loading={isLoading}
        />
      </div>
    </Accordion>
  );
};
const AccordionActions = styled.div`
  padding: 0 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  //> :first-child {
  //  margin-right: 1rem;
  //}
  > * {
    margin-bottom: 1rem;
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  > :not(:first-child) {
    margin-left: 1rem;
  }
`;
export default ChildrenAccordion;
