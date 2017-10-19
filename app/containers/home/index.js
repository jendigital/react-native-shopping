/**
 * Created by luanp on 22/09/2016.
 */
'use strict';

import React, {Component, PropTypes} from 'react';
import {Text, View, ListView} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from "react-native-router-flux";

import Constants from './../../Constants';
import Languages from './../../Languages';
import Toolbar from "./../../components/Toolbar";
import ImageCard from "./../../components/ImageCard";
import Spinner from "./../../components/Spinner";
import {fetchAllCategories, selectCategory} from '../../reducers/Category/actions'
import {clearProducts} from '../../reducers/Product/actions'

class Home extends Component {
    constructor(props) {
        super(props);
        this.styles = {
            container: {flex: 1},
            imageCard: {
                width: Constants.Dimension.ScreenWidth(1),
                height: 200,
            },
            mainCategoryText: {
                color: 'white',
                fontSize: 25
            },
            numberOfProductsText: {
                color: 'white',
                fontSize: 25
            }
        };
    }

    static propTypes = {
        Category: PropTypes.object.isRequired,
        clearProducts: PropTypes.func.isRequired,
    };

    componentDidMount() {
        if (this.props.Category.categories.length == 0)
            this.props.fetchAllCategories();
    }

    render() {
        const subCategories = this.props.Category.categories.filter(category => category.parent === Constants.WooCommerce.RootCategoryId);

        return (
            <View style={this.styles.container}>
                <Toolbar title={this.props.title}
                         back={this.props.back}
                         cart={this.props.cart}
                         wishList={this.props.wishList}/>
                {this.props.Category.isFetching ?
                    <Spinner fullStretch/> :
                    this.props.Category.error ?
                        this.renderError(this.props.Category.error) :
                        this.renderCategories(subCategories)
                }
            </View>
        );
    }

    renderError(error) {
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text>{error}</Text>
        </View>
    }

    renderCategories(data) {
        const dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => true});
        const goToCategory = (category) => {
            this.props.clearProducts();
            this.props.selectCategory(category.id, undefined);
            Actions.category({initCategoryId: category.id, title: category.name});
        }

        const renderRow = (category) => (
            <ImageCard
                onPress={() => goToCategory(category) }
                style={this.styles.imageCard}
                source={ category.image.src ? {uri: category.image.src} : undefined }
            >
                <Text style={this.styles.mainCategoryText}>{category.name}</Text>
                <Text style={this.styles.numberOfProductsText}>{category.count} {Languages.products}</Text>
            </ImageCard>
        );

        return <ListView
            dataSource={dataSource.cloneWithRows(data)}
            renderRow={renderRow}
            enableEmptySections={true}
        />
    }
}

const mapStateToProps = (state) => {
    return {
        Category: state.Category,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllCategories: () => {
            dispatch(fetchAllCategories());
        },
        selectCategory: (selectedCategoryId, selectedCategoryName) => {
            dispatch(selectCategory(selectedCategoryId, selectedCategoryName));
        },
        clearProducts: () => dispatch(clearProducts()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
