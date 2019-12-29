import React, {Component} from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

import "./ReportTable.css";

class ReportTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      update: false,
    };
  }

  render() {
    
    return (
      <Table>
      <Thead>
        <Tr>
          {
            this.props.headers.map((value, index) => {
              return <Th key={index}>{value}</Th>
            })
          }
        </Tr>
      </Thead>
      <Tbody>

        { (this.props.data) &&
          Object.keys(this.props.data).map(key =>
                <Tr key={key}>
                  <Td>{this.props.data[key].name}</Td>
                  <Td>{parseFloat(this.props.data[key].withdrawal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Td>
                  <Td>{parseFloat(this.props.data[key].deposit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Td>
                </Tr>
            )
        
          }
        
      </Tbody>
    </Table>
    );
  };
}

export default ReportTable;