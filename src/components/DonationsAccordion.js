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

const DonationsAccordion = ({ isLoading, setRefresh, rows, columns }) => {
  const [filter, setFilter] = useState('');
  const handleChange = ({ target: { value } }) => setFilter(value);
  const [filteredRows, setFilteredRows] = useState(rows);
  useEffect(() => {
    const result = rows.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredRows(result);
  }, [filter, rows]);
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id='children-expansion'>
        <Typography variant='h6'>Donation List</Typography>
      </AccordionSummary>
      <AccordionAction>
        <TextField
          label='Filter by Name'
          variant='outlined'
          name={'donationFilter'}
          onChange={handleChange}
          value={filter}
        />
        <Button
          color='primary'
          size='small'
          startIcon={<CachedIcon />}
          variant='outlined'
          onClick={() => setRefresh(true)}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </AccordionAction>
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
const AccordionAction = styled.div`
  padding: 0 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  > * {
    margin-bottom: 1rem;
  }
`;
export default DonationsAccordion;
