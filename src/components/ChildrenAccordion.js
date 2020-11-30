import React, { useEffect, useState } from 'react';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';
import { DataGrid } from '@material-ui/data-grid';
import Accordion from '@material-ui/core/Accordion';
import styled from 'styled-components/macro';
import TextField from '@material-ui/core/TextField';

const ChildrenAccordion = ({
  rows,
  columns,
  setRefresh,
  isLoading,
  handleAddChild,
}) => {
  const [filter, setFilter] = useState('');
  const handleChange = ({ target: { value } }) =>
    setFilter(value.toLowerCase());

  const [filteredRows, setFilteredRows] = useState(rows);
  useEffect(() => {
    const result = rows.filter(item =>
      item.name.toLowerCase().includes(filter)
    );
    setFilteredRows(result);
  }, [filter]);
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
        <div className='buttons'>
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
            Add a child
          </Button>
        </div>
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
  padding: 0 1rem 1rem;
  display: flex;
  justify-content: space-between;
  > .buttons > * {
    margin-left: 1rem;
  }
`;
export default ChildrenAccordion;
