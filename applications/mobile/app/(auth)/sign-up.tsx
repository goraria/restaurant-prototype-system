import React, { useState } from "react"
import Animated, { FadeInUp, FadeOutDown, LayoutAnimationConfig } from "react-native-reanimated";
import { SignUp } from "@clerk/clerk-expo/web"
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/element/ThemeToggle";
import { Info } from "@/lib/icons/Info";
import { Input } from "@/components/ui/input";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  console.log('SignUpScreen mounted')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    console.log(emailAddress, password)

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }
  
  const [progress, setProgress] = useState(78);
  
  function updateProgressValue() {
    setProgress(Math.floor(Math.random() * 100));
  }

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>DEBUG: Verification Screen</Text>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <>
      <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
        <Card className="w-full p-0 rounded-2xl">
          <Card className="w-full px-10 py-8 gap-9 rounded-2xl rounded-b-lg">{/* max-w-sm */}
            <CardHeader className="justify-center items-center p-0 h-[46px] gap-1">
              <Text
                className="w-full text-[17px] leading-6 font-bold text-center"
                // style={{ lineHeight: 24 }}
              >
                Create your account
              </Text>
              <Text
                className="w-full text-[13px] leading-[18px] text-center m-0"
                style={{ margin: 0 }}
              >
                Welcome! Please fill in the details to get started.
              </Text>
            </CardHeader>
            <CardContent className="gap-6 p-0">
              <View className="flex-row gap-[6px] justify-between">
                <Button variant="outline" className="shadow shadow-foreground/5 flex-1 h-8 rounded-lg">
                  <Text>Update</Text>
                </Button>
                <Button variant="outline" className="shadow shadow-foreground/5 flex-1 h-8 rounded-lg">
                  <Text>Update</Text>
                </Button>
                <Button variant="outline" className="shadow shadow-foreground/5 flex-1 h-8 rounded-lg">
                  <Text>Update</Text>
                </Button>
              </View>
              <View className="flex-row justify-center items-center text-center m-0 h-4">
                <View className="flex-1 h-px bg-muted-foreground/40" />
                <Text className="mx-2 text-[13px] text-muted-foreground">or</Text>
                <View className="flex-1 h-px bg-muted-foreground/40" />
              </View>
              <View>
                <View className="gap-8">
                  <View className="gap-6">
                    <View className="flex-row w-full gap-4">
                      <View className="flex-1 gap-2">
                        <Text className="text-[13px] leading-[18px]">First name</Text>
                        <Input
                          // className="h-[30px] px-[12px] py-[6px]"
                          className="h-[30px] px-3 text-[13px] rounded-lg"
                          autoCapitalize="sentences"
                          value={emailAddress}
                          placeholder="First name"
                          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                        />
                      </View>
                      <View className="flex-1 gap-2">
                        <Text className="text-[13px] leading-[18px]">Last name</Text>
                        <Input
                          // className="h-[30px] px-[12px] py-[6px]"
                          className="h-[30px] px-3 text-[13px] rounded-lg"
                          autoCapitalize="none"
                          value={emailAddress}
                          placeholder="Last name"
                          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                        />
                      </View>
                    </View>
                    <View className="gap-2">
                      <Text className="text-[13px] leading-[18px]">Username</Text>
                      <Input
                        // className="h-[30px] px-[12px] py-[6px]"
                        className="h-[30px] px-3 text-[13px] rounded-lg"
                        autoCapitalize="none"
                        value={emailAddress}
                        // placeholder="username"
                        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                      />
                    </View>
                    <View className="gap-2">
                      <Text className="text-[13px] leading-[18px]">Email address</Text>
                      <Input
                        // className="h-[30px] px-[12px] py-[6px]"
                        className="h-[30px] px-3 text-[13px] rounded-lg"
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Enter your email address"
                        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                      />
                    </View>
                    <View className="gap-2">
                      <Text className="text-[13px] leading-[18px]">Password</Text>
                      <Input
                        // className="h-[30px] px-[12px] py-[6px]"
                        className="h-[30px] px-3 text-[13px] rounded-lg"
                        autoCapitalize="none"
                        value={password}
                        placeholder="Enter your password"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                      />
                    </View>
                  </View>
                  <Button 
                    className="w-full text-foreground rounded-lg h-[30px]"
                    onPress={onSignUpPress}
                  >
                    <Text className="text-[13px]">Continue</Text>
                  </Button>
                </View>
              </View>
            </CardContent>
          </Card>
          <View className="flex-row justify-center items-center text-center leading-6 px-8 py-4 mx-16 gap-1">
            <Text className="flex text-[13px]">Already have an account?</Text>
            <Link href="/sign-in" className="flex font-semibold">
              <Text className="text-[13px]">Sign in</Text>
            </Link>
          </View>
        </Card>
      </View>

      {/* <SignUp /> */}

      {/* <View style={styles.container}>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>DEBUG: Sign Up Screen</Text>
        <Text>Sign up</Text>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={onSignUpPress}>
          <Text>Continue</Text>
        </TouchableOpacity>
      </View> */}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
});
