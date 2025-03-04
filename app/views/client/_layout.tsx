import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "Home",
};


export default function ClientLayout() {
  return (
    <Stack>
      <Stack.Screen name="Home"  options={{
            headerShown: false,
          }}/>

<Stack.Screen name="SearchScreen"  options={{
            headerShown: false,
          }}/>

<Stack.Screen name="Itinéraires"  options={{
            headerShown: false,
          }}/>

<Stack.Screen name="TrajetScreen"  options={{
            headerShown: false,
          }}/>
    </Stack>
    
  );
}
