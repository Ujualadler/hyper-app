import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  Alert,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconButton, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/Context/AuthContext";

const settingsOptions = [
  {
    title: "Change Password",
    icon: <Ionicons name="lock-closed-outline" size={24} color="black" />,
    url: "/change-password",
  },
  {
    title: "Language",
    icon: <Ionicons name="language-outline" size={24} color="black" />,
    url: "/language",
  },
];

const informationOption = [
  {
    title: "About App",
    icon: <MaterialIcons name="info-outline" size={24} color="black" />,
    url: "/about",
  },
  {
    title: "Terms & Conditions",
    icon: <FontAwesome name="file-text-o" size={24} color="black" />,
    url: "/terms-and-conditions",
  },
  {
    title: "Privacy Policy",
    icon: <Ionicons name="shield-checkmark-outline" size={24} color="black" />,
    url: "/privacy-policy",
  },
  {
    title: "Share This App",
    icon: <Ionicons name="share-social-outline" size={24} color="black" />,
    url: "/share",
  },
];

export default function TabTwoScreen() {
  const router = useRouter();

  const { userName} = useAuth();

  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const openImagePicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Cancel",
            "Take Photo",
            "Choose from Gallery",
            "Remove Current Picture",
          ],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            openCamera();
          } else if (buttonIndex === 2) {
            openGallery();
          } else if (buttonIndex === 3) {
            setSelectedImage("");
          }
        }
      );
    } else {
      Alert.alert(
        "Select an option",
        "",
        [
          { text: "Take Photo", onPress: openCamera },
          { text: "Choose from Gallery", onPress: openGallery },
          {
            text: "Remove Current Picture",
            onPress: () => setSelectedImage(""),
          },
          { text: "Cancel", style: "cancel" },
        ],
        { cancelable: true }
      );
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white", marginTop: 70 }}>
      {/* <ThemedView style={styles.titleContainer}>
        <IconButton
          icon="chevron-left"
          size={20}
          onPress={() => router.push("/" as any)}
        />
        <ThemedText type="subtitle" style={{ color: "#027bad" }}>
          Profile
        </ThemedText>
      </ThemedView> */}

      <ThemedView style={styles.profileContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri:
                selectedImage ||
                "https://static.vecteezy.com/system/resources/thumbnails/036/280/650/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
            }}
            style={styles.profileImage}
          />
          <IconButton
            icon="pencil"
            size={20}
            iconColor="white"
            style={styles.editButton}
            onPress={openImagePicker}
          />
        </View>
        <Text
          style={{ textAlign: "center", fontWeight: 700 }}
          variant="bodyLarge"
        >
          {userName}
        </Text>
        <Text
          style={{ textAlign: "center", color: "grey" }}
          variant="bodyMedium"
        >
          ABCD PUBLIC SCHOOL
        </Text>
      </ThemedView>
      <ProfileHeading title="Genaral Settings" />
      {settingsOptions.map((data: any, index: any) => (
        <View
          key={index}
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginVertical: 5,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              gap: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {data.icon}
            <Text variant="bodyLarge">{data.title}</Text>
          </View>
          <IconButton
            icon="chevron-right"
            size={24}
            onPress={() => router.push("/" as any)}
          />
        </View>
      ))}

      <ProfileHeading title="Information" />

      {informationOption.map((data: any, index: any) => (
        <View
          key={index}
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginVertical: 5,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              gap: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {data.icon}
            <Text variant="bodyLarge">{data.title}</Text>
          </View>
          <IconButton
            icon="chevron-right"
            size={24}
            onPress={() => router.push("/" as any)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

function ProfileHeading({ title }: any) {
  return (
    <View
      style={{
        backgroundColor: "#ffbc38",
        padding: 12,
        paddingLeft: 20,
        marginVertical: 10,
      }}
    >
      <Text style={{ color: "#111", fontWeight: 700 }}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4, // Offset the shadow to create a bottom shadow effect
    },
    shadowOpacity: 0.3, // Adjust the shadow transparency
    shadowRadius: 4.65, // Adjust the shadow blur
    elevation: 8, // Required for shadow on Android
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  imageWrapper: {
    position: "relative",
    width: 130,
    height: 130,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    gap: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 65, // Half of the width/height to make it a circle
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#027bad",
    color: "white",
  },
});
