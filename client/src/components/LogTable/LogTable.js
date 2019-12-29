import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import moment from "moment";

import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

import "./LogTable.css";

class LogTable extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          changed: false
      }
  }    
  
  async getType(index) {
      let type = await this.props.getTransactionType(index);

      if (type !== null && type !== undefined) { 
        return type;
      } else {
        return "Not defined";
      }
  }

  getTypeHandler(index) {
    if (index === 1) return 'Deposit'
    else if (index === 2) return 'Withdrawal'
    else return 'Not found';
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
        {
          (this.props.data) &&
          this.props.data.map((value, index) => {  
            let t_type = this.getTypeHandler(value.t_type_id);

              return (<Tr key={index}>
                    <Td>{moment(value.t_date).format('lll')}</Td>
                    <Td>{t_type}</Td>
                    <Td>{parseFloat(value.t_amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Td>
                    <Td>{parseFloat(value.new_balance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Td>
              </Tr>)



            // this.getType(value.t_type_id).then(type => {
            //   console.log(type);
            //   t_type = type;

            //   <Tr key={index}>
            //         <Td>{moment(value.t_date).format('lll')}</Td>
            //         <Td>{t_type}</Td>
            //         <Td>{parseFloat(value.t_amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Td>
            //         <Td>{parseFloat(value.new_balance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Td>
            //   </Tr>
            // })
              
            //   .catch(error => {
            //     console.log('Error');
            //   })
            })
          }
      
    </Tbody>
  </Table>
  );
};
}

export default LogTable;