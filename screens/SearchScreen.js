import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function SearchScreen({ navigation }) {
  const [searchCriteria, setSearchCriteria] = useState(''); // Chỉ cần một ô nhập liệu
  const [classes, setClasses] = useState([]); // Danh sách các lớp học đã liên kết với courses

  useEffect(() => {
    const classRef = ref(database, 'class/');
    onValue(classRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const classList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        
        // Lấy thông tin courses và liên kết với từng class dựa trên courseId
        const courseRef = ref(database, 'courses/');
        onValue(courseRef, (courseSnapshot) => {
          const coursesData = courseSnapshot.val();
          if (coursesData) {
            const classesWithCourseInfo = classList.map((classItem) => {
              const courseInfo = coursesData[classItem.courseId];
              return {
                ...classItem,
                courseInfo: courseInfo || {},
              };
            });
            setClasses(classesWithCourseInfo);
          }
        });
      }
    });
  }, []);

  // Lọc các lớp học dựa trên ngày trong tuần hoặc thời gian
  const filteredClasses = searchCriteria
    ? classes.filter((classItem) => {
        const dayMatch = classItem.courseInfo.day && 
          classItem.courseInfo.day.toLowerCase().includes(searchCriteria.toLowerCase());
        const timeMatch = classItem.courseInfo.time &&
          classItem.courseInfo.time.toLowerCase().includes(searchCriteria.toLowerCase());
        return dayMatch || timeMatch;
      })
    : [];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Enter Day (e.g., Monday) or Time (e.g., 16PM)"
        value={searchCriteria}
        onChangeText={setSearchCriteria}
        style={{
          borderWidth: 1,
          padding: 8,
          marginVertical: 10,
          borderRadius: 5,
        }}
      />
      <Text style={{fontSize: 18, color: 'blue', fontWeight: 'bold' }}>
        Result
      </Text>
      {searchCriteria ? (
        filteredClasses.length > 0 ? (
          <FlatList
            data={filteredClasses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Detail', { classId: item.id })} // Chuyển sang màn hình chi tiết
                style={styles.classItem}
              >
                <View style={styles.textRow}>
                  <Text style={styles.classText}>Teacher: {item.teacher}</Text>
                  <Text style={styles.classText}>Date: {item.date}</Text>
                </View>
                <Text style={styles.classText}>Time: {item.courseInfo.time}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No classes found matching your criteria.
          </Text>
        )
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          Enter search criteria to find classes.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  classItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    backgroundColor: "#f5f5f5",
  },
  classText: {
    fontSize: 14,
    marginRight: 18,
  },
  textRow: {
    flexDirection: 'row', // Căn ngang
    justifyContent:  'space-between', // Đảm bảo khoảng cách đều
    marginBottom: 5, // Khoảng cách giữa các dòng
  },
});
