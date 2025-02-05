import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from "react-native";
import { AuthLayout } from "../";
import {
  FormInput,
  TextButton,
  TextIconbutton2
} from "../../components";
import { FONTS, SIZES, COLORS, icons } from "../../constants";
import { utils } from "../../utils";
import axios, { endpoints, authApis } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyDispatchContext } from "../../configs/MyUserContext"; // Import MyDispatchContext từ MyUserContext.js

const SignIn = ({ navigation }) => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showpass, setShowpass] = useState(false);
  const dispatch = useContext(MyDispatchContext);

  const users = {
    email: {
      title: "Email",
      field: "email",
      secure: false,
      icon: "text"
    },
    password: {
      title: "Mật khẩu",
      field: "password",
      secure: true,
      icon: "eye"
    }
  };

  const updateUser = (value, field) => {
    setUser({ ...user, [field]: value });
  };

  const isEnabledSignIn = () => {
    return user.email !== "" && user.password !== "" && emailError === "";
  };

  const login = async () => {
    setLoading(true);
    try {
      const res = await axios.post(endpoints.login, {
        "client_id": "mJ52oLKHCQSJpOw38KnRzEGEcXPzD7bRLX4t8SbF",
        "client_secret": "Lw1lCkVtBetYSHtFKL8gr9Z5TBMKSOhCGgJSh5pdXgYDKSJ3kaUdxBxpay2KJzeZyRbfconrD9z3OrCcYtl4GFh3d4vUmNzey0AdfPUVfDnWMXJ9qXyNDcpZjAZeyXtf",
        'grant_type': "password",
        'username': user.email,
        'password': user.password
      });

      await AsyncStorage.setItem('token', res.data.access_token);

      const token = await AsyncStorage.getItem("token");
      console.info("Token:", token); // Ghi lại mã thông báo để kiểm tra
      const userData = await authApis(token).get(endpoints['current-user']);
      console.info("User Data:", userData.data); // Ghi lại thông tin người dùng để kiểm tra
      await AsyncStorage.setItem('user', JSON.stringify(userData.data));
      dispatch({ "type": "login", "payload": userData.data });
      console.log("Trang Home");

      // Sử dụng setTimeout để chuyển hướng đến trang Home sau khi đăng nhập thành công
      setTimeout(() => {
        navigation.replace("Home"); // replace để không thể quay lại màn hình Sign In
      }, 500);

    } catch (ex) {
      console.error(ex.response ? ex.response.data : ex.message);
      Alert.alert("Login failed", ex.response ? ex.response.data.error_description : "Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <AuthLayout
          title="Let's Sign You in"
          subtitle="Welcome back, you've been missed"
        >
          <View style={{ flex: 1, marginTop: SIZES.padding * 2 }}>
            {/* Form input */}
            {Object.values(users).map(u => (
              <FormInput
                key={u.field}
                label={u.title}
                secureTextEntry={u.secure && !showpass}
                containerStyle={{ marginTop: SIZES.radius }}
                onChange={(value) => updateUser(value, u.field)}
                appendComponent={
                  u.secure ? (
                    <TouchableOpacity
                      style={{
                        width: 40,
                        alignItems: "flex-end",
                        justifyContent: "center",
                      }}
                      onPress={() => setShowpass(!showpass)}
                    >
                      <Image
                        source={showpass ? icons.eye_close : icons.eye}
                        style={{ height: 20, width: 20, tintColor: COLORS.gray }}
                      />
                    </TouchableOpacity>
                  ) : null
                }
              />
            ))}

            {/* Sign In */}
            <TextButton
              label="Sign In"
              buttonContainerStyle={{
                height: 55,
                alignItems: "center",
                marginTop: SIZES.padding,
                borderRadius: SIZES.radius,
                backgroundColor: isEnabledSignIn()
                  ? COLORS.primary
                  : COLORS.transparentPrimary,
              }}
              disabled={isEnabledSignIn() ? false : true}
              onPress={login}
              loading={loading}
            />

            {/* Sign up */}
            <View
              style={{
                flexDirection: "row",
                marginTop: SIZES.radius,
                justifyContent: "center",
              }}
            >
              <Text style={{ color: COLORS.darkGray, ...FONTS.body3 }}>
                Don't have an account?
              </Text>
              <TextButton
                label="Sign Up"
                buttonContainerStyle={{ backgroundColor: null, marginLeft: 3 }}
                labelStyle={{ color: COLORS.primary, ...FONTS.h3 }}
                onPress={() => navigation.navigate("SignUp")}
              />
            </View>
          </View>
          {/* Footer */}
          <View style={{ marginBottom: SIZES.radius }}>

            {/* Google */}
            <TextIconbutton2
              containerStyle={{
                height: 50,
                alignItems: "center",
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.lightGray2,
                marginTop: SIZES.radius
              }}
              icon={icons.google}
              iconPosition="LEFT"
              iconStyle={{ tintColor: null }}
              labelStyle={{ marginLeft: SIZES.radius }}
              label="Continue With Google"
            />
          </View>
        </AuthLayout>
      </ScrollView>
      {loading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default SignIn;