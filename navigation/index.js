import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Hoặc thư viện icon bạn đang dùng

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import CartScreen from "../screens/CartScreen";
import DetailsClassScreen from "../screens/DetailsClassScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="YogaApp"
        component={HomeScreen}
        options={{
          title: 'YogaApp',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu" size={24} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailsClassScreen}
        options={{
          title: 'Detail',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

function CartStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu" size={24} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailsClassScreen}
        options={{
          title: 'Detail',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

function SearchStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu" size={24} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailsClassScreen}
        options={{
          title: 'Detail',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator >
        <Drawer.Screen name="YogaApp" component={HomeStack} options={{ headerShown: false }}/>
        <Drawer.Screen
          name="Search"
          component={SearchStack} // Sử dụng CartStack thay vì CartScreen
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="Cart"
          component={CartStack} // Sử dụng CartStack thay vì CartScreen
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
