import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                errorMessage: 'Please enter a valid name.',
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'an@example.com'
                },
                errorMessage: 'Please enter a valid email.',
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: '123 Texas St'
                },
                errorMessage: 'Please enter a valid street name.',
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            city: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Austin'
                },
                errorMessage: 'Please enter a city.',
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            state: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'TX'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zip: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: '787xx'
                },
                value: '',
                errorMessage: 'Please enter a valid zip code. 5 characters',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'TX', displayValue: 'Texas'},
                        {value: 'TN', displayValue: 'What?'},
                        {value: 'PA', displayValue: 'Pennsylvania'}
                    ]
                },
                value: 'TX',
                validation: {},
                valid: true
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'faster', displayValue: 'Faster'},
                        {value: 'normal', displayValue: 'Normal'},
                        {value: 'slower', displayValue: 'Slower'}
                    ]
                },
                value: 'faster', //set a default value incase the user doesnt touch the select field
                validation: {},
                valid: true
            }
       },
       formIsValid: false,
       loading: false
    }

    checkValidity(value, rules) {
        let isValid = true;
        if(!rules) {
            return true;
        }

        //the '&& isValid' makes sures it passes all rules, not just the last one
        if(rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        //create any rules dynamically
        if(rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        
        //transforms data
        const formData = {};
        for(let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData
        }

        //.json is specific for firebase only
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading: false});
            });
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        }
        const updateFormElement = {
            ...updatedOrderForm[inputIdentifier]
        } //deep clone

        updateFormElement.value = event.target.value;
        updateFormElement.valid = this.checkValidity(updateFormElement.value, updateFormElement.validation);
        updateFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updateFormElement;
        
        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
        //console.log(event.target.value);
    }

    render() {
        const formElementsArray = [];
        
        for(let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                { formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id} 
                        elementType={formElement.config.elementType} 
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid} //need to pass inverse here
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        errorMessage={formElement.config.errorMessage}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button disabled={!this.state.formIsValid} btnType="Success">Order</Button>
            </form>
        );

        if(this.state.loading) {
            form = <Spinner />
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;