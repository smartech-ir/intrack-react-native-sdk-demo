import React from 'react';
import {ScrollView, Box, VStack, Text, Pressable} from 'native-base';

const Section = ({title, description, onPress}) => {
  return (
    <Pressable onPress={onPress}>
      <Box shadow={1} bg="white" p={8} rounded={4}>
        <Text fontSize={24} color="black" fontWeight="bold">
          {title}
        </Text>
        <Text fontSize={16} color="gray.500">
          {description}
        </Text>
      </Box>
    </Pressable>
  );
};

export default function HomeScreen({navigation}) {
  return (
    <ScrollView>
      <VStack space={4} alignItems="stretch" p={4}>
        <Section
          navigation={navigation}
          onPress={() => navigation.navigate('Events')}
          title="Sending Events"
          description="send custom event to InTrack"
        />
        <Section
          navigation={navigation}
          onPress={() => navigation.navigate('Users')}
          title="User Management"
          description="manage user details"
        />
        <Section
          navigation={navigation}
          onPress={() => navigation.navigate('Push')}
          title="Push Notification"
          description="push notification"
        />
        <Section
          navigation={navigation}
          onPress={() => navigation.navigate('Crash')}
          title="Crash Reporting"
          description="send crash data to InTrack"
        />
      </VStack>
    </ScrollView>
  );
}
