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
          initialRouteName={"OnBoarding"} // Đảm bảo OnBoarding tồn tại
        >
          {/* Chỉ hiển thị màn hình OnBoarding */}
          <Stack.Screen name="OnBoarding" component={OnBoarding} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Otp" component={Otp} />

          <Stack.Screen name="Home" component={CustomDrawer} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;