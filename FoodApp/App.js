import React, { useReducer, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createStore, applyMiddleware } from "redux";
import { Provider as ReduxProvider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./stores/rootReducer";
import CustomDrawer from "./navigation/CustomDrawer";
import { MyDispatchContext, MyUserContext } from "./configs/MyUserContext"; // Import MyDispatchContext và MyUserContext
import MyUserReducers from "./configs/MyUserReducers"; // Import MyUserReducers
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  FoodDetail,
  StoreDetail,
  Checkout,
  MyCard,
  MyCart,
  Success,
  AddCard,
  DeliveryStatus,
  Home,
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
  const [user, dispatch] = useReducer(MyUserReducers, null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        dispatch({ type: 'login', payload: JSON.parse(userData) });
      }
    };

    loadUser();
  }, []);

  return (
    <ReduxProvider store={store}>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName={user ? "Home" : "OnBoarding"}
            >
              <Stack.Screen name="OnBoarding" component={OnBoarding} />
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="Otp" component={Otp} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen name="Home" component={CustomDrawer} />
              <Stack.Screen name="StoreDetail" component={StoreDetail} />
              <Stack.Screen name="FoodDetail" component={FoodDetail} />
              <Stack.Screen name="Checkout" component={Checkout} />
              <Stack.Screen name="MyCart" component={MyCart} />
              <Stack.Screen name="Success" component={Success} options={{ gestureEnabled: false }} />
              <Stack.Screen name="AddCard" component={AddCard} />
              <Stack.Screen name="MyCard" component={MyCard} />
              <Stack.Screen name="DeliveryStatus" component={DeliveryStatus} options={{ gestureEnabled: false }} />

            </Stack.Navigator>
          </NavigationContainer>
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </ReduxProvider>
  );
};

export default App;


