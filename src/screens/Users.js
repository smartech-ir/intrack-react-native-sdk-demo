import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Button,
  VStack,
  HStack,
  Input,
  TextArea,
  useToast,
  Text,
  Switch,
  Select,
  Divider,
  FormControl,
  Stack,
} from 'native-base';
import InTrack from 'intrack-react-native-bridge';

const TextInput = props => (
  <FormControl isRequired={props.isRequired}>
    <Stack>
      <FormControl.Label>{props.label}</FormControl.Label>
      <Input
        isDisabled={props.isDisabled}
        background="white"
        placeholder={props.label}
        value={props.userDetails[props.formKey]}
        onChangeText={value =>
          props.setUserDetails({...props.userDetails, [props.formKey]: value})
        }
      />
      {props.helperText ? (
        <FormControl.HelperText>{props.helperText}</FormControl.HelperText>
      ) : null}
    </Stack>
  </FormControl>
);

const SwitchInput = props => (
  <HStack alignItems="center" space={4}>
    <Text>{props.label}</Text>
    <Switch
      isChecked={props.userDetails[props.formKey]}
      onToggle={checked =>
        props.setUserDetails({
          ...props.userDetails,
          [props.formKey]: checked,
        })
      }
    />
  </HStack>
);

const SelectInput = props => (
  <FormControl>
    <FormControl.Label>{props.label}</FormControl.Label>
    <Select
      background="white"
      placeholder={props.label}
      selectedValue={props.userDetails[props.formKey]}
      onValueChange={itemValue =>
        props.setUserDetails({...props.userDetails, [props.formKey]: itemValue})
      }>
      <Select.Item label="Other" value="other" />
      <Select.Item label="Female" value="female" />
      <Select.Item label="Male" value="male" />
    </Select>
  </FormControl>
);

const TextareaInput = props => (
  <FormControl>
    <FormControl.Label>{props.label}</FormControl.Label>
    <TextArea
      background="white"
      h={20}
      placeholder={props.label}
      value={props.userDetails[props.formKey]}
      onChangeText={value => {
        props.setUserDetails({
          ...props.userDetails,
          [props.formKey]: value,
        });
      }}
    />
    {props.helperText ? (
      <FormControl.HelperText>{props.helperText}</FormControl.HelperText>
    ) : null}
  </FormControl>
);

const FORM_INPUTS = {
  text: TextInput,
  switch: SwitchInput,
  select: SelectInput,
  textarea: TextareaInput,
};

const userForm = [
  {
    formKey: 'userId',
    label: 'User ID',
    type: 'text',
    helperText: 'UserId is required and should be less than 100 charachter',
    isRequired: true,
  },
  {
    formKey: 'firstName',
    label: 'First Name',
    type: 'text',
    helperText: 'First Name must be less than 1000 charachter',
  },
  {
    formKey: 'lastName',
    label: 'Last Name',
    type: 'text',
    helperText: 'Last Name must be less than 1000 charachter',
  },
  {
    formKey: 'gender',
    label: 'Gender',
    type: 'select',
  },
  {
    formKey: 'email',
    label: 'Email',
    type: 'text',
    helperText: 'it must be a valid email format',
  },
  {
    formKey: 'hashedEmail',
    label: 'Hashed Email',
    type: 'text',
  },
  {
    formKey: 'phone',
    label: 'Phone Number',
    type: 'text',
    helperText: 'must containes country code (+989123456789)',
  },
  {
    formKey: 'hashedPhone',
    label: 'Hashed Phone Number',
    type: 'text',
  },
  {
    formKey: 'emailOptIn',
    label: 'Email OptIn?',
    type: 'switch',
  },
  {
    formKey: 'smsOptIn',
    label: 'SMS OptIn?',
    type: 'switch',
  },
  {
    formKey: 'pushOptIn',
    label: 'Push OptIn?',
    type: 'switch',
  },
  {
    formKey: 'webPushOptIn',
    label: 'WebPush OptIn?',
    type: 'switch',
  },
  {
    formKey: 'country',
    label: 'Country',
    type: 'text',
    helperText: 'it be less than 250 charachter',
  },
  {
    formKey: 'state',
    label: 'state',
    type: 'text',
    helperText: 'it be less than 250 charachter',
  },
  {
    formKey: 'city',
    label: 'city',
    type: 'text',
    helperText: 'it be less than 250 charachter',
  },
  {
    formKey: 'birthday',
    label: 'Birthday',
    type: 'text',
    helperText: 'it be a valid ISO-8601 date (1970-01-01)',
  },
  {
    formKey: 'company',
    label: 'Company',
    type: 'text',
    helperText: 'it be less than 250 charachter',
  },
  {
    formKey: 'attributes',
    label: 'Attributes',
    type: 'textarea',
    helperText:
      'privide a valid JSON. each key should be less than 50 character',
  },
];

export default function UserDetailsScreen() {
  const [userDetails, setUserDetails] = useState({
    emailOptIn: true,
    smsOptIn: true,
    pushOptIn: true,
    webPushOptIn: true,
    attributes: `{
      "key1": 1234,
      "key2": "value"
    }`,
  });
  const [userId, setUserId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    InTrack.getUserId(uid => {
      setUserId(uid);
      setUserDetails({...userDetails, userId: uid});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserDetails = () => {
    const ud = Object.assign({}, userDetails);
    try {
      if (userDetails.attributes) {
        ud.attributes = JSON.parse(userDetails.attributes);
      }
    } catch (error) {
      toast.show({
        description: 'attributes is not a valid json',
      });
      return;
    }

    //remove empty objects/strings
    Object.keys(ud)
      .filter(
        key =>
          !['emailOptIn', 'smsOptIn', 'pushOptIn', 'webPushOptIn'].includes(
            key,
          ),
      )
      .forEach(key => {
        if (!ud[key]) {
          delete ud[key];
        }
      });

    return ud;
  };

  const loginUser = () => {
    InTrack.login(getUserDetails());
    setUserId(userDetails.userId);
    toast.show({
      description: 'login command called',
    });
  };

  const updateUserProfile = () => {
    InTrack.updateProfile(getUserDetails());
    toast.show({
      description: 'updateProfile command called',
    });
  };

  const logoutUser = () => {
    InTrack.logout();
    setUserId(null);
    toast.show({
      description: 'logout command called',
    });
  };

  return (
    <ScrollView>
      <VStack space={4} alignItems="stretch" p={4}>
        {userForm.map(item => {
          const Comp = FORM_INPUTS[item.type];
          return (
            <Comp
              key={item.formKey}
              isDisabled={item.formKey === 'userId' && !!userId}
              {...item}
              setUserDetails={setUserDetails}
              userDetails={userDetails}
            />
          );
        })}
        <Divider />
        <Button isDisabled={!!userId} onPress={loginUser}>
          Login
        </Button>
        <Button isDisabled={!userId} onPress={updateUserProfile}>
          Update Profile
        </Button>
        <Button isDisabled={!userId} onPress={logoutUser}>
          Logout
        </Button>
      </VStack>
    </ScrollView>
  );
}
