import { StyleSheet, Text, View, Pressable, Platform, SafeAreaView, FlatList, RefreshControl, ToastAndroid } from 'react-native';
import axios from 'axios';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import UserAvatar from "react-native-user-avatar";

export default function App() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = 'https://random-data-api.com/api/v2/users';

  const fetchUsers = async (count = 10) => {
    try {
      const response = await axios.get(`${API_URL}?size=${count}`);
      const data = response.data;

      const usersArray = Array.isArray(data) ? data : [data];

      const userData = usersArray.map((user) => ({
        id: user.id.toString(),
        avatar: user.avatar,
        firstName: user.first_name,
        lastName: user.last_name,
      }));
      return userData;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      const initialUsers = await fetchUsers();
      setUsers(initialUsers);
      console.log("Users State after fetch:", initialUsers);
    })();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    const newUsers = await fetchUsers();
    setUsers(newUsers);
    setRefreshing(false);

    if (Platform.OS === "android") {
      ToastAndroid.show("User(s) loaded", ToastAndroid.SHORT);
    } else {
      Alert.alert("Info", "User(s) loaded");
    }
  };

  const addUser = async () => {
    const newUser = await fetchUsers(1);
    setUsers((prevUsers) => [...newUser, ...prevUsers]);
    if (Platform.OS === "android") {
      ToastAndroid.show("User added successfully!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Info", "User added successfully!");
    };
  };

  const FAB = (props) => (
    <Pressable
      style={fabStyles.container}
      onPress={props.onPress}
    >
      <Text style={fabStyles.title}>{props.title}</Text>
    </Pressable>
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {Platform.OS === 'android' && (
        <UserAvatar size={50} src={item.avatar} style={styles.avatar} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>
          {item.firstName} {item.lastName}
        </Text>
      </View>
      {Platform.OS === 'ios' && (
        <UserAvatar size={50} src={item.avatar} style={styles.avatar} />
      )}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          Welcome to User List
        </Text>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl= {
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
        <FAB title="+" onPress={addUser} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 60,
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  textContainer: {
    flex: 1,
    alignItems: Platform.OS === "ios" ? "flex-end" : "flex-start",
    marginHorizontal: 10,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "500",
  },
  avatar: {
    marginHorizontal: 10,
    flexShrink: 0,
  },
});

const fabStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 70,
    right: 40,
    backgroundColor: "#007AFF",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
