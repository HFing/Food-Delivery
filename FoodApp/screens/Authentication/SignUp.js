import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { AuthLayout } from "../";
import {
  FormInput,
  TextButton,
  TextIconbutton2
} from "../../components";
import { FONTS, SIZES, COLORS, icons } from "../../constants";
import { utils } from "../../utils";
import axios from '../../configs/APIs'; // Import axios instance from APIs.js
import { endpoints } from '../../configs/APIs'; // Import endpoints from APIs.js

const SignUp = ({ navigation }) => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm: ""
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showpass, setShowpass] = useState(false);

  const users = {
    first_name: {
      title: "Tên",
      field: "first_name",
      secure: false,
      icon: "text"
    },
    last_name: {
      title: "Họ và tên lót",
      field: "last_name",
      secure: false,
      icon: "text"
    },
    username: {
      title: "Tên đăng nhập",
      field: "username",
      secure: false,
      icon: "text"
    },
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
    },
    confirm: {
      title: "Xác nhận mật khẩu",
      field: "confirm",
      secure: true,
      icon: "eye"
    }
  };

  const updateUser = (value, field) => {
    setUser({ ...user, [field]: value });
  };

  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Bạn chưa cấp quyền truy cập thư viện ảnh!");
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        setAvatar({ uri: result.assets[0].uri });
      }
    }
  };

  const isEnabledSignup = () => {
    return (
      user.first_name !== "" &&
      user.last_name !== "" &&
      user.username !== "" &&
      user.password !== "" &&
      user.confirm !== "" &&
      user.email !== "" &&
      emailError === "" &&
      usernameError === "" &&
      passwordError === ""
    );
  };

  const register = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      for (let k in user) {
        if (k !== 'confirm') {
          form.append(k, user[k]);
        }
      }
      if (avatar) {
        form.append('avatar', {
          uri: avatar.uri,
          name: avatar.fileName || 'avatar.jpg',
          type: avatar.type || 'image/jpeg'
        });
      }
      const response = await axios.post(endpoints.register, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 201) {
        navigation.navigate("SignIn");
      } else {
        Alert.alert("Registration failed", "Please try again.");
      }
    } catch (ex) {
      console.error(ex);
      Alert.alert("Registration failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <AuthLayout
          title="Getting Started"
          subtitle="Create an account to continue!"
          titleContainerStyle={{ marginTop: SIZES.radius }}
        >
          {/* Form input and signup */}
          <View style={{ flex: 1, marginTop: SIZES.padding }}>
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

            {/* Upload Avatar */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginTop: SIZES.radius,
                alignItems: 'center',
              }}
              onPress={pickImage}
            >
              <Image
                source={icons.camera}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.gray,
                }}
              />
              <Text style={{ marginLeft: SIZES.radius, color: COLORS.gray, ...FONTS.body3 }}>
                {avatar ? "Change Avatar" : "Upload Avatar"}
              </Text>
            </TouchableOpacity>
            {avatar && (
              <Image
                source={{ uri: avatar.uri }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: SIZES.radius,
                  marginTop: SIZES.radius,
                }}
              />
            )}

            {/* Sign up and signin */}
            <TextButton
              label="Sign Up"
              buttonContainerStyle={{
                height: 55,
                alignItems: "center",
                marginTop: SIZES.padding,
                borderRadius: SIZES.radius,
                backgroundColor: isEnabledSignup()
                  ? COLORS.primary
                  : COLORS.transparentPrimary,
              }}
              disabled={isEnabledSignup() ? false : true}
              onPress={register}
              loading={loading}
            />

            <View
              style={{
                flexDirection: "row",
                marginTop: SIZES.radius,
                justifyContent: "center",
              }}
            >
              <Text style={{ color: COLORS.darkGray, ...FONTS.body3 }}>
                Already have an account?
              </Text>
              <TextButton
                label="Sign In"
                buttonContainerStyle={{ backgroundColor: null, marginLeft: 5 }}
                labelStyle={{ color: COLORS.primary, ...FONTS.h3 }}
                onPress={() => navigation.navigate("SignIn")}
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
    </KeyboardAvoidingView>
  );
};

export default SignUp;