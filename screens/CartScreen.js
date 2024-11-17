import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../firebaseConfig";

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [cancelQuantity, setCancelQuantity] = useState("");

  useEffect(() => {
    const cartRef = ref(database, "cart");
    onValue(cartRef, (snapshot) => {
      const items = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.key = childSnapshot.key;
        items.push(item);
      });
  
      const groupedItems = groupByItem(items); // Sử dụng hàm mới
      setCartItems(groupedItems);
    });
  }, []);
  

  
  
  
  
  

  const handleView = (classId) => {
    navigation.navigate("Detail", { classId });
  };

  const handleCancel = (item) => {
    setCurrentItem(item);
    setCancelQuantity("");
    setModalVisible(true);
  };

  const confirmCancel = () => {
    const quantityToCancel = parseInt(cancelQuantity, 10);
    if (
      isNaN(quantityToCancel) ||
      quantityToCancel < 0 ||
      quantityToCancel > currentItem.quantity
    ) {
      Alert.alert("Lỗi", "Số lượng hủy không hợp lệ!");
      return;
    }

    const keysToCancel = currentItem.keys.slice(0, quantityToCancel);
    keysToCancel.forEach((key) => {
      const itemRef = ref(database, `cart/${key}`);
      remove(itemRef).catch((error) =>
        Alert.alert("Lỗi", "Không thể hủy lớp học: " + error.message)
      );
    });

    Alert.alert("Thông báo", "Đã hủy lớp học thành công!");
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        {item.type} ({item.quantity})
      </Text>
      <Button
        title="View"
        onPress={() => handleView(item.classId)}
        color="#4CAF50"
      />
      <Button
        title="Cancel"
        onPress={() => handleCancel(item)}
        color="#F44336"
      />
    </View>
  );
  

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.type}
      />

      {/* Modal for adjusting cancel quantity */}
      {currentItem && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Điều chỉnh số lượng hủy cho {currentItem.type}
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Nhập số lượng muốn hủy"
                value={cancelQuantity}
                onChangeText={(text) => setCancelQuantity(text)}
              />
              <View style={styles.modalButtons}>
                <Button
                  title="Hủy bỏ"
                  onPress={() => setModalVisible(false)}
                  color="#F44336"
                />
                <Button
                  title="Xác nhận"
                  onPress={confirmCancel}
                  color="#4CAF50"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    
  },
});
