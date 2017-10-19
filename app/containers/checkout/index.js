/**
 * Created by luanp on 22/09/2016.
 */
'use strict';

import React, {Component, PropTypes} from 'react';
import {Image, ScrollView, Text, View, TextInput} from 'react-native';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import {Actions} from "react-native-router-flux";
import Icon from "react-native-vector-icons/Ionicons";

import WooWorker from './../../services/WooWorker';
import Constants from './../../Constants';
import Languages from './../../Languages';
import Toolbar from "./../../components/Toolbar";
import Button from "./../../components/Button";
import DeliveryInfoForm from './DeliveryInfoForm';
import {emptyCart} from './../../reducers/Cart/actions';

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: 0,
            value: {
                payment_method: '',
            }
        }
        this.styles = {
            container: {flex: 1, backgroundColor: '#F0F0F0'},
            card: {
                height: null,
                width: Constants.Dimension.ScreenWidth(0.9),
                marginLeft: Constants.Dimension.ScreenWidth(0.05),
                marginTop: Constants.Dimension.ScreenWidth(0.05),
                backgroundColor: 'white',
                padding: 10,
            }
        };
        this.validate = () => {
            const result = this.refs.deliveryForm.onPress();
            if (result !== null) {
                this.setState({stage: 1})
                this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true});
                this.deliveryInfo = result;
            }
        }
        this.purchase = () => {
            const result = this.refs.paymentForm.getValue();
            if (result !== null) {

                let line_items = [];
                this.props.Cart.cartItems.forEach((item) => {
                    line_items.push({
                        "product_id": item.product.id,
                        "quantity": item.quantity,
                        "variation_id": item.variation == undefined ? '' : item.variation.id,
                    });
                }, this);

                let body = {
                    customer_id: this.props.customer.id,
                    payment_method: result.payment_method,
                    customer_note: this.deliveryInfo.note,
                    billing: this.deliveryInfo,
                    shipping: this.deliveryInfo,
                    line_items: line_items,
                };
                // console.log(JSON.stringify(body))
                // alert(JSON.stringify(body))

                this.setState({isLoading: true});
                WooWorker.createOrder(body, (responseData) => {
                    this.setState({
                        stage: 2,
                        orderID: responseData.id,
                        isLoading: false,
                    })
                    this.props.emptyCart();
                });
            }
        }
        this.onChange = (value) => this.setState({value: value});
    }

    static propTypes = {
        customer: PropTypes.object.isRequired,
        Cart: PropTypes.object.isRequired,
        emptyCart: PropTypes.func.isRequired,
    };

    render() {
        const renderPhaseOne = () => (
            <ScrollView ref="scrollView">
                <Image
                    source={Constants.Image.CheckoutStep1}
                    style={{
                        width: Constants.Dimension.ScreenWidth() - 50,
                        height: 50,
                        marginLeft: 25,
                        marginTop: 30,
                        marginBottom: 10
                    }}
                    resizeMode="contain"
                />
                <View style={{
                    backgroundColor: 'white',
                    paddingTop: 10,
                    marginLeft: 20,
                    marginRight: 20,
                    marginBottom: 10
                }}>
                    <DeliveryInfoForm ref="deliveryForm" customer={this.props.customer}/>
                </View>
                <Button onPress={() => this.validate()} borderLess>{Languages.ProceedPayment}</Button>
            </ScrollView>);

        const renderPhaseTwo = () => (
            <ScrollView ref="scrollView">
                <Image
                    source={Constants.Image.CheckoutStep2}
                    style={{
                        width: Constants.Dimension.ScreenWidth() - 50,
                        height: 50,
                        marginLeft: 25,
                        marginTop: 30,
                        marginBottom: 10
                    }}
                    resizeMode="contain"
                />
                {this.renderPayments()}
                {this.renderPaymentDetails()}
                {this.renderCoupon()}
                <Button onPress={() => this.purchase()}
                        style={{marginTop: Constants.Dimension.ScreenWidth(0.05)}}
                        borderLess
                        isLoading={this.state.isLoading}>{Languages.Purchase}</Button>
            </ScrollView>);

        const renderPhaseThree = () => (
            <View style={{flex: 1}}>
                <View style={{backgroundColor: '#F0F0F0', height: null, width: Constants.Dimension.ScreenWidth()}}>
                    <Image
                        source={Constants.Image.CheckoutStep3}
                        style={{
                            width: Constants.Dimension.ScreenWidth() - 50,
                            height: 50,
                            marginLeft: 25,
                            marginTop: 20,
                            marginBottom: 10
                        }}
                        resizeMode="contain"
                    />
                </View>
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    <Icon name={'ios-happy-outline'}
                          style={{
                              textAlign: "center",
                              fontSize: 200,
                              color: Constants.Color.ButtonBackground,
                          }}/>
                    <Text style={{
                        color: Constants.Color.TextDark,
                        fontSize: 22,
                        padding: 20,
                        textAlign: "center"
                    }}>{Languages.OrderCompleted}</Text>
                    <Text style={{
                        padding: 10,
                        "fontSize": 13,
                        textAlign: "center",
                    }}>{Languages.OrderId + " " + this.state.orderID}</Text>
                    <Text style={{
                        padding: 10,
                        "fontSize": 13,
                        textAlign: "center",
                    }}>{Languages.OrderTip}</Text>
                </View>

                <Button onPress={() => Actions.home({type: "reset"})} borderLess
                        style={{marginBottom: 10}}>{Languages.BackToHome}</Button>
            </View>);

        return (
            <View style={[this.styles.container, {backgroundColor: this.state.stage == 2 ? 'white' : '#F0F0F0'}]}>
                <Toolbar title={this.props.title}
                         back={this.props.back}
                         cart={this.props.cart}
                         wishList={this.props.wishList}/>
                {this.state.stage == 0 ? renderPhaseOne() :
                    this.state.stage == 1 ? renderPhaseTwo() : renderPhaseThree()}
            </View>
        );
    }

    renderPaymentDetails() {
        switch (this.state.value.payment_method) {
            case 'bacs':
                return <View style={this.styles.card}>
                    <Text>Card Number*</Text>
                    <TextInput
                        underlineColorAndroid='transparent'
                        placeholder='0000-0000-0000-0000'
                        defaultValue={'1234-5678-1234-5678'}
                        placeholderTextColor={Constants.Color.TextLight}
                        style={{
                            borderWidth: 1, borderColor: Constants.Color.ViewBorder, height: 40, marginBottom: 5,
                        }}/>
                    <Text>Card Name*</Text>
                    <TextInput
                        underlineColorAndroid='transparent'
                        placeholder={Languages.CardNamePlaceholder}
                        defaultValue={'Piksal Studio'}
                        placeholderTextColor={Constants.Color.TextLight}
                        style={{
                            borderWidth: 1, borderColor: Constants.Color.ViewBorder, height: 40, marginBottom: 5,
                        }}/>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                        <View style={{flexDirection: 'row'}}>
                            <View >
                                <Text>MM</Text>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    maxLength={2}
                                    defaultValue={'01'}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: Constants.Color.ViewBorder,
                                        height: 40,
                                        width: 50,
                                        marginRight: 10,
                                    }}/>
                            </View>
                            <View >
                                <Text>YY</Text>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    defaultValue={'16'}
                                    maxLength={2}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: Constants.Color.ViewBorder,
                                        height: 40,
                                        width: 50,
                                    }}/>
                            </View>
                        </View>
                        <View>
                            <Text>CVV</Text>
                            <TextInput
                                underlineColorAndroid='transparent'
                                defaultValue={'123'}
                                maxLength={3}
                                style={{
                                    borderWidth: 1, borderColor: Constants.Color.ViewBorder, height: 40, width: 50,
                                }}/>
                        </View>
                    </View>
                </View>
            case 'cod':
                return <View style={[this.styles.card, {flexDirection: 'row'}]}>
                    <Image source={Constants.Image.CashOnDelivery} resizeMode='contain'
                           style={{
                               width: Constants.Dimension.ScreenWidth(0.25),
                               height: Constants.Dimension.ScreenWidth(0.125),
                           }}/>
                    <View style={{
                        justifyContent: 'center',
                        margin: 10,
                        width: Constants.Dimension.ScreenWidth(0.6)
                    }}>
                        <Text numberOfLines={2}>{Languages.PayWithCoD}</Text>
                    </View>
                </View>
            case 'paypal':
                return <View style={[this.styles.card, {flexDirection: 'row'}]}>
                    <Image source={Constants.Image.PayPal} resizeMode='contain'
                           style={{
                               width: Constants.Dimension.ScreenWidth(0.25),
                               height: Constants.Dimension.ScreenWidth(0.125),
                           }}/>
                    <View style={{
                        justifyContent: 'center',
                        margin: 10,
                        width: Constants.Dimension.ScreenWidth(0.6)
                    }}>
                        <Text numberOfLines={2}>{Languages.PayWithPayPal}</Text>
                    </View>
                </View>
            case 'stripe':
                return <View style={[this.styles.card, {flexDirection: 'row'}]}>
                    <Image source={Constants.Image.Stripe} resizeMode='contain'
                           style={{
                               width: Constants.Dimension.ScreenWidth(0.25),
                               height: Constants.Dimension.ScreenWidth(0.125),
                           }}/>
                    <View style={{
                        justifyContent: 'center',
                        margin: 10,
                        width: Constants.Dimension.ScreenWidth(0.6)
                    }}>
                        <Text numberOfLines={2}>{Languages.PayWithStripe}</Text>
                    </View>
                </View>
            default:
                return <View/>
        }
    }

    renderPayments() {
        const onChange = (value) => {
            this.refs.paymentForm.validate();
            this.setState({value: value});
        }

        return (<View style={this.styles.card}>
            <t.form.Form
                ref="paymentForm"
                type={Payment}
                value={this.state.value}
                onChange={onChange}
                options={options}
            />
        </View>);
    }

    renderCoupon() {
        return <View style={this.styles.card}>
            <Text style={{marginBottom: 5, marginLeft: 5}}>{Languages.ApplyCoupon}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <TextInput
                    underlineColorAndroid='transparent'
                    placeholder={Languages.CouponPlaceholder}
                    placeholderTextColor={Constants.Color.TextLight}
                    style={{
                        width: Constants.Dimension.ScreenWidth(0.6),
                        borderWidth: 1, borderColor: Constants.Color.ViewBorder, height: 40,
                    }}/>
                <Button autoMargin={false}
                        onPress={()=> alert("Coupon is not valid")}
                        style={{
                            width: Constants.Dimension.ScreenWidth(0.2),
                            height: 40,
                            marginTop: 0,
                            borderWidth: 0
                        }}>{Languages.APPLY}</Button>
            </View>
        </View>
    }
}

const Payments = t.enums({
    bacs: 'Credit Card',
    // cheque: 'Check Payments',
    cod: Languages.CashOnDelivery,
    paypal: 'PayPal',
    stripe: 'Stripe',
});
const Payment = t.struct({
    payment_method: Payments,              // a required string
});
const options = {
    auto: 'none',
    fields: {
        payment_method: {
            nullOption: {value: '', text: Languages.PaymentMethod},
            error: Languages.PaymentMethodError,
        },
    }
}

const mapStateToProps = (state) => {
    return {
        customer: state.Customer,
        Cart: state.Cart,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        emptyCart: () => {
            dispatch(emptyCart());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
