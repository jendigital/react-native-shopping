/**
 * Created by luanp on 22/09/2016.
 */
'use strict';

import React, {Component, PropTypes} from 'react';
import {Text, View, Image, StyleSheet, ScrollView, TouchableWithoutFeedback, Animated} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toolbar from "./../../components/Toolbar/index";
import Button from "../../components/Button/index";
import TextInputWrapper from './Form/TextInputWrapper'


class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
        }
    }

    static propTypes = {
        routes: PropTypes.object.isRequired,
    };

    componentWillMount() {
        this.animateValue1 = new Animated.Value(1);
        this.animateValue2 = new Animated.Value(1);
    }


    render() {

        const animatedStyle = {
            opacity: this.animateValue1,
            transform: [

                {scale: this.animateValue2}
            ]
        };


        return (
            <View style={{flex: 1}}>
                <Toolbar title={this.props.title} back={false} cart={true}/>
                <View style={{
                    flex: 1, alignItems: 'center',
                    justifyContent: 'center',
                }}>

                    <TouchableWithoutFeedback
                        onPress={() => {
                            Animated.sequence([
                                Animated.parallel([
                                    Animated.timing(this.animateValue1, {
                                        toValue: 0.5,
                                        duration: 100,
                                    }),
                                    Animated.spring(this.animateValue2, {
                                        toValue: 2
                                    })
                                ]),
                                Animated.parallel([
                                    Animated.timing(this.animateValue1, {
                                        toValue: 1,
                                        duration: 100,
                                    }),
                                    Animated.spring(this.animateValue2, {
                                        toValue: 1
                                    })
                                ])
                            ]).start()
                        }}
                    >
                        <Animated.View ref="view" style={animatedStyle}>
                            <Icon name={'car'} size={50}/>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        routes: state,
        // todos: state.todoApp.todos,
        // todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // onTodoClick: (id) => {
        //     dispatch(toggleTodo(id));
        // }
    }
}

//connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
export default connect(mapStateToProps, mapDispatchToProps)(Test);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

