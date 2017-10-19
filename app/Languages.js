/**
 * Created by Luan on 10/26/2016.
 */
// ES6 module syntax
import LocalizedStrings from 'react-native-localization';

/* API
 setLanguage(languageCode) - to force manually a particular language
 getLanguage() - to get the current displayed language
 getInterfaceLanguage() - to get the current device interface language
 formatString() - to format the passed string replacing its placeholders with the other arguments strings
 */

let Languages = new LocalizedStrings({
    en: {
        //Exit Confirm Dialog
        Exit: "Exit",
        ExitConfirm: "Are you sure you want to exit this app",
        YES: "YES",
        CANCEL: "CANCEL",
        Confirm: 'Confirm',

        //Scene's Titles
        Home: "Home",
        Intro: "Intro",
        Product: 'Product',
        Cart: 'Cart',
        WishList: 'WishList',

        //Home
        products: 'products',

        //TopBar
        ShowFilter: 'Show Filter',
        HideFilter: 'Hide Filter',
        Sort: 'Sort',

        //Category
        ThereIsNoMore: 'There is no more product to show',

        //Product
        AddtoCart: 'Add to Cart',
        AddtoWishlist: 'Add to Wishlist',
        ProductVariations: 'Variations',
        NoVariation: 'This product don\'t have any variation',
        AdditionalInformation: 'Description',
        NoProductDescription: 'No Product Description',
        ProductReviews: "Reviews",
        NoReview: 'This product don\'t have any reviews ...yet',
        BUYNOW: 'BUY NOW',
        ProductLimitWaring: 'You can\'t add more than 5 product',

        //Cart
        NoCartItem: 'There is no product in cart',
        Total: 'Total',
        Checkout: 'Checkout',
        EmptyCheckout: 'Sorry, you can\'t check out an empty cart',
        RemoveCartItemConfirm: "Remove this product from cart?",

        //Wishlist
        NoWishListItem: 'There is no item in wishlist',
        MoveAllToCart: 'Add all to cart',
        EmptyWishList: 'Empty wishlist',
        EmptyAddToCart: 'Sorry, the wishlist is empty',
        RemoveWishListItemConfirm: "Remove this product from wishlist?",

        //Sidemenu
        SignIn: 'Log In',
        SignOut: 'Log Out',

        //Checkout
        Checkout: 'Checkout',
        ProceedPayment: 'Proceed Payment',
        Purchase: 'Purchase',
        CashOnDelivery: 'Cash on Delivery',
        PaymentMethod: 'Payment Method - Not select',
        PaymentMethodError: 'Please select your payment method',
        PayWithCoD: 'Your purchase will be pay when goods were delivered',
        PayWithPayPal: 'Your purchase will be pay with PayPal',
        PayWithStripe: 'Your purchase will be pay with Stripe',
        ApplyCoupon: 'Apply Coupon',
        CouponPlaceholder: 'COUPON CODE',
        APPLY: 'APPLY',
        CardNamePlaceholder: 'Name written on card',
        BackToHome: 'Back to Home',
        OrderCompleted: 'Your order was completed',
        OrderId: 'Your order id is ',
        OrderTip: 'Tip: You could track your order status in "My Orders" section from side menu',

        //myorder
        MyOrder: 'My Order',
        // OrderNumber: 'Order Number',
        // OrderDate: 'Order Date:',
        // Status: 'Order Number',

        News: 'News',
        PostDetails: "Post Details",
    },
    vi: {
        exit: "Thoát",
        exitConfirm: "Thoát ứng dung?",
        YES: "ĐỒNG Ý",
        CANCEL: "HỦY"
    },
});

export default Languages;