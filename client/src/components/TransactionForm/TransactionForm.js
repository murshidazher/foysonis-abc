import React from "react";
import "./TransactionForm.css";


import SelectTransactionType from "../SelectTransactionType/SelectTransactionType";

const TransactionForm = props => {
  return (
    <div>
      <div className="input-group input--btn">
        <input
          className="form-control"
          type="number"
          min="0.01"
          step="0.1"
          onChange={props.onInputChange}
          placeholder="Enter the amount for transaction"
        />
        <SelectTransactionType selected={props.selectedIndex} data={props.transactionType} 
                    onChangeSelectedTransaction={props.onChangeSelectedTransaction}/>
        <button type="button" className="btn--classic b--no-left" onClick={props.onSubmit}>
          Proceed
        </button>
      </div>
    </div>
  );
};

export default TransactionForm;
