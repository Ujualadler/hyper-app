// useGoogleAuth.ts
import { useAuthRequest, makeRedirectUri, AuthSessionResult, DiscoveryDocument } from "expo-auth-session";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../FireBase/firebaseConfig";

// Define Google OAuth discovery document
const discovery: DiscoveryDocument = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "YOUR_WEB_CLIENT_ID", // Replace with your Web Client ID
      redirectUri: makeRedirectUri(), // Automatically sets redirect URI without useProxy
      scopes: ["profile", "email"],
    },
    discovery // Provide the discovery document here
  );

  const handleGoogleSignIn = async () => {
    const result = (await promptAsync()) as AuthSessionResult;
    if (result.type === "success" && result.params.id_token) {
      const { id_token } = result.params;
      const credential = GoogleAuthProvider.credential(id_token);
      await signInWithCredential(auth, credential);
    }
  };

  return { handleGoogleSignIn, request, response };
};


// import React, { useEffect } from "react";
// import { Button } from "react-native";
// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from "expo-web-browser";
// import Constants from "expo-constants";

// WebBrowser.maybeCompleteAuthSession();

// export default function GoogleSignIn() {
//   // Define discovery object for Google OAuth
//   const discovery = {
//     authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
//     tokenEndpoint: "https://oauth2.googleapis.com/token",
//     revocationEndpoint: "https://oauth2.googleapis.com/revoke",
//   };

//   // Create the Google config object
//   const config = {
//     clientId: Constants.manifest?.extra?.GOOGLE_CLIENT_ID ?? "",
//     scopes: ["profile", "email"],
//     redirectUri: makeRedirectUri({
//       scheme: "yourapp",
//     }),
//   };

//   // Use the `useAuthRequest` hook with config and discovery
//   const [request, response, promptAsync] = Google.useAuthRequest(config, discovery);

//   useEffect(() => {
//     if (response?.type === "success") {
//       const { authentication } = response;
//       // Use authentication.accessToken as needed
//     }
//   }, [response]);

//   return (
//     <Button
//       title="Sign in with Google"
//       onPress={() => promptAsync()}
//       disabled={!request}
//     />
//   );
// }
