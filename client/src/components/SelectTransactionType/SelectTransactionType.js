import React from "react";

import "./SelectTransactionType.css";

class SelectTransactionType extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            changed: false
        }
    }
    
    onSelectChange = (event) => {
        const value = ((event.target.value).trim());
        this.props.onChangeSelectedTransaction(value);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
          this.updateChanged();
        }
    }

    updateChanged = () => {
        this.setState({ changed: true });
    }

    render() {
        const { data } = this.props;

        return (
            <div className="custom-select" style={{ width: 200 + 'px' }}>
                
                <select id='select-transaction' defaultValue={(this.props.selected) ? this.props.selected:'DEFAULT' }  onChange={this.onSelectChange} >
                     <option value="DEFAULT" key={-1} disabled>Select Your Transaction Type ...</option>
            
                {
                    (data !== null && data !== undefined) &&
                            (
                                data.map((value, index) => {
                                        return <option key={index} value={index}>{value[1]}</option>

                                }))     
                }
                      
                </select>
            </div>
        );
    };
}
  
  export default SelectTransactionType;
  

