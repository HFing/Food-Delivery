import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./stores/rootReducer";
import CustomDrawer from "./navigation/CustomDrawer";

import {
  FoodDetail,
  Checkout,
  MyCard,
  MyCart,
  Success,
  AddCard,
  DeliveryStatus,
  Home,
  Map,
  OnBoarding,
  SignIn,
  SignUp,
  Otp,
  ForgotPassword,
  AuthLayout,
} from "./screens";

// Tạo Redux store
const store = createStore(rootReducer, applyMiddleware(thunk));

// Tạo Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={"Home"} // Đảm bảo Home tồn tại
        >
          {/* Chỉ hiển thị màn hình Home */}
          <Stack.Screen name="Home" component={CustomDrawer} />
          <Stack.Screen name="FoodDetail" component={FoodDetail} />
          <Stack.Screen name="Checkout" component={Checkout} />
          <Stack.Screen name="MyCart" component={MyCart} />
          <Stack.Screen name="Success" component={Success} options={{ gestureEnabled: false }} />
          <Stack.Screen name="AddCard" component={AddCard} />
          <Stack.Screen name="MyCard" component={MyCard} />
          <Stack.Screen name="DeliveryStatus" component={DeliveryStatus} options={{ gestureEnabled: false }} />
          <Stack.Screen name="Map" component={Map} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;