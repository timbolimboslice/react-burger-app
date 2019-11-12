import React from 'react';

import classes from './Input.css';

const input = (props) => {
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if(props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
    }

    let validationError = null;
    if (props.invalid && props.touched) {
        validationError = <p>{props.errorMessage}</p>;
    }

    switch(props.elementType) {
        case('input'):
            inputElement = <input 
                onChange={props.changed}
                className={inputClasses.join(' ')} 
                {...props.elementConfig} 
                value={props.value} /> //props allow you to pass whatever props apply for that particular tag
            break;
        case('textarea'):
            inputElement = <textarea 
                onChange={props.changed}
                className={inputClasses.join(' ')} 
                {...props.elementConfig}
                value={props.value} />
            break;
        case('select'):
            inputElement = (
                <select
                    onChange={props.changed} 
                    className={inputClasses.join(' ')}
                    value={props.value}>
                        {props.elementConfig.options.map(option => (
                            <option key={option.value} value={option.value}>{option.displayValue}</option>
                        ))}
                </select>
            );
            break; 
        default:
            inputElement = <input 
                onChange={props.changed}
                className={inputClasses.join(' ')} 
                {...props.elementConfig}
                value={props.value} />;
    }

    return (
        <div className={classes.Input}>
            <label className={classes.label}>{props.label}</label>
            {inputElement}
            {validationError}
        </div>
    );
    
};

export default input;