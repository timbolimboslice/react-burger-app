import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions'; //automatically picks up index.js
import axios from '../../../src/axios-orders';

export class BurgerBuilder extends Component {
    //older, not as modern
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }

    //these properties are meant for UI purposes so thats why theyre using local state
    state = {
        purchasing: false
    };

    //MOVED TO ACTIONS
    componentDidMount () {
        this.props.onInitIngredients();
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey] 
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        
        //this doesnt use state anymore
        //this.setState({purchasable: sum > 0 });
        return sum > 0;
        //returns a bool now
    }

    //HANDLER BY REDUCER NOW AND REDUX

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     //using es6 spread operator to clone this object because with state, 
    //     //it should be updated in a inmutable way
    //     //taking properties of old ingredient state into new ingredient state
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     //accessing the type that needs to be updated, the whole point of this handler
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({ totalPrice: newPrice, ingredients: updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);
    // }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if(oldCount <= 0) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     //using es6 spread operator to clone this object because with state, 
    //     //it should be updated in a inmutable way
    //     //taking properties of old ingredient state into new ingredient state
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     //accessing the type that needs to be updated, the whole point of this handler
    //     updatedIngredients[type] = updatedCount;
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
    //     this.setState({ totalPrice: newPrice, ingredients: updatedIngredients});
    // }

    purchaseHandler = () => {
        //only if we are authenicated
        if(this.props.isAuthenticated) {
            this.setState({purchasing: true});
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    
    purchaseContinueHandler = () => {

        //HANDLED THROUGH REDUX NOW, no more passing query params to the component
        //const queryParams = [];
        // for(let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // };
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render () {
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;
        let orderSummary = null;
        
        //copied in an inmutable way
        const disabledInfo = {
            ...this.props.ings
        };
        
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        if(this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)} //this returns true or false now instead of being handled by the state, also need to pass ingredients now since ingredients isnt a part of the state
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}
                        price={this.props.price}/>
                </Aux>
            );
            orderSummary = <OrderSummary
                price={this.props.price}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                ingredients={this.props.ings} />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>  
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }; 
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));