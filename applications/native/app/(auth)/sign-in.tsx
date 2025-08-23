import React, { useState } from "react"
import Animated, { FadeInUp, FadeOutDown, LayoutAnimationConfig } from "react-native-reanimated";
import { SignIn } from "@clerk/clerk-expo/web"
import { useSignIn } from "@clerk/clerk-expo"
import { Link, useRouter } from "expo-router"
import { View, StyleSheet, Pressable } from "react-native"
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
import { PencilLine, Eye, EyeOff } from "lucide-react-native";

export default function SignInPage() {
  const [layout, setLayout] = useState(0)
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace("/")
      } else {
        // If the status isn"t complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // console.log("SignInScreen mounted")

  const [progress, setProgress] = useState(78);
  
  function updateProgressValue() {
    setProgress(Math.floor(Math.random() * 100));
  }

  const onContinueFromEmail = () => {
    const value = emailAddress.trim();
    if (!value) {
      setEmailError('Email hoặc username là bắt buộc');
      return;
    }
    setEmailError(null);
    setLayout(1);
  }

  return (
    <>
      {layout === 0 ? (
        <>
          <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
            <Card className="w-full p-0 rounded-2xl">
              <Card className="w-full px-10 py-8 gap-9 rounded-2xl rounded-b-lg">{/* max-w-sm */}
                <CardHeader className="justify-center items-center p-0 h-[46px] gap-1">
                  <Text
                    className="w-full text-[17px] leading-6 font-bold text-center"
                    // style={{ lineHeight: 24 }}
                  >
                    {/* Sign in to Waddles */}
                    Đăng nhập vào Waddles
                  </Text>
                  <Text
                    className="w-full text-[13px] leading-[18px] text-center m-0"
                    style={{ margin: 0 }}
                  >
                    {/* Welcome back! Please sign in to continue */}
                    Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục
                  </Text>
                  {/* <Avatar alt="Ichibulup de Gortheia"s Avatar" className="w-24 h-24">
                    <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
                    <AvatarFallback>
                      <Text>RS</Text>
                    </AvatarFallback>
                  </Avatar> */}
                  {/* <View className="p-3" />
                  <CardTitle className="pb-2 text-center">Japtor Gorthenburg</CardTitle>
                  <View className="flex-row">
                    <CardDescription className="text-base font-semibold">Scientist</CardDescription>
                    <Tooltip delayDuration={150}>
                      <TooltipTrigger className="px-2 pb-0.5 active:opacity-50">
                        <Info size={14} strokeWidth={2.5} className="w-4 h-4 text-foreground/70" />
                      </TooltipTrigger>
                      <TooltipContent className="py-2 px-4 shadow">
                        <Text className="native:text-lg">Freelance</Text>
                      </TooltipContent>
                    </Tooltip>
                  </View> */}
                </CardHeader>
                <CardContent className="gap-6 p-0">
                  {/* <View className="flex-row justify-around gap-3">
                    <View className="items-center">
                      <Text className="text-sm text-muted-foreground">Dimension</Text>
                      <Text className="text-xl font-semibold">C-137</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-sm text-muted-foreground">Age</Text>
                      <Text className="text-xl font-semibold">22</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-sm text-muted-foreground">Species</Text>
                      <Text className="text-xl font-semibold">Human</Text>
                    </View>
                  </View> */}
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
                    <Text className="mx-2 text-[13px] text-muted-foreground">
                      {/* or */}
                      hoặc
                    </Text>
                    <View className="flex-1 h-px bg-muted-foreground/40" />
                  </View>
                  <View>
                    <View className="gap-8">
                      <View className="gap-2">
                        <Text className="text-[13px] leading-[18px]">
                          {/* Email address or username */}
                          Email hoặc tên người dùng
                        </Text>
                        <Input
                          // className="h-[30px] px-[12px] py-[6px]"
                          className={`h-[30px] px-3 text-[13px] rounded-lg ${emailError ? 'border-destructive' : ''}`}
                          autoCapitalize="none"
                          // autoFocus
                          value={emailAddress}
                          // placeholder="Enter email or username"
                          placeholder="Nhập email hoặc tên người dùng"
                          keyboardType="email-address"
                          onChangeText={(val) => {
                            setEmailAddress(val);
                            if (emailError && val.trim()) setEmailError(null);
                          }}
                        />
                        {emailError ? (
                          <Text className="text-[12px] text-destructive mt-1">{emailError}</Text>
                        ) : null}
                      </View>
                      <Button 
                        className="w-full text-foreground rounded-lg h-[30px]"
                        onPress={onContinueFromEmail}
                      >
                        <Text className="text-[13px]">
                          {/* Continue */}
                          Tiếp tục
                        </Text>
                      </Button>
                    </View>
                  </View>
                  {}
                </CardContent>
                {/* <CardFooter className="flex-col gap-3 p-0">
                  <View className="flex-row items-center overflow-hidden">
                    <Text className="text-sm text-muted-foreground">Productivity: </Text>
                    <LayoutAnimationConfig skipEntering>
                      <Animated.View
                        key={progress}
                        entering={FadeInUp}
                        exiting={FadeOutDown}
                        className="w-11 items-center"
                      >
                        <Text className="text-sm font-bold text-sky-600">{progress}%</Text>
                      </Animated.View>
                    </LayoutAnimationConfig>
                  </View>
                  <Progress value={progress} className="h-2" indicatorClassName="bg-sky-600" />
                  <View />
                  <Button
                    variant="outline"
                    className="shadow shadow-foreground/5"
                    onPress={updateProgressValue}
                  >
                    <Text>Update</Text>
                  </Button>
                </CardFooter> */}
              </Card>
              <View className="flex-row justify-center items-center text-center leading-6 px-8 py-4 m-0 gap-1">
                <Text className="flex text-[13px]">
                  {/* Don't have an account? */}
                  Không có tài khoản?
                </Text>
                <Link href="/sign-up" className="flex font-semibold">
                  <Text className="text-[13px]">
                    {/* Sign up */}
                    Đăng ký
                  </Text>
                </Link>
              </View>
            </Card>
          </View>
        </>
      ) : layout === 1 ? (
        <>
          <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
            <Card className="w-full p-0 rounded-2xl">
              <Card className="w-full px-10 py-8 gap-9 rounded-2xl">{/* max-w-sm */}
                <CardHeader className="justify-center items-center p-0 gap-1">
                  <Text
                    className="w-full text-[17px] leading-6 font-bold text-center"
                    // style={{ lineHeight: 24 }}
                  >
                    {/* Enter your password */}
                    Nhập mật khẩu
                  </Text>
                  <Text
                    className="w-full text-[13px] leading-[18px] text-center m-0"
                    style={{ margin: 0 }}
                  >
                    {/* Enter the password associated with your account */}
                    Nhập mật khẩu được liên kết với tài khoản của bạn
                  </Text>
                  <View className="flex-row justify-center items-center text-center m-0 h-[18px] gap-1">
                    <Text className="text-[13px]">{emailAddress}</Text>
                    <Button
                      variant="link"
                      className="p-0 m-0"
                      onPress={() => setLayout(0)}
                    >
                      <PencilLine className="text-foreground" size={13} />
                    </Button>
                  </View>
                </CardHeader>
                <CardContent className="gap-6 p-0">
                  <View className="gap-4">
                    <View className="gap-8">
                      <View className="gap-2">
                        <View className="flex-row h-[18px] justify-between text-center items-center">
                          <Text className="text-[13px] leading-[18px]">
                            {/* Password */}
                            Mật khẩu
                          </Text>
                          <Link href="/forgot-password" asChild>
                            <Button variant="link" className="p-0 h-[18px] ">
                              <Text className="text-[13px] text-muted-foreground">
                                {/* Forgot password? */}
                                Quên mật khẩu?
                              </Text>
                            </Button>
                          </Link>
                        </View>
                        <View className="relative">
                          <Input
                            // className="h-[30px] px-[12px] py-[6px]"
                            className="h-[30px] px-3 pr-9 text-[13px] rounded-lg"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                            secureTextEntry={!showPassword}
                            value={password}
                            // placeholder="Enter your password"
                            placeholder="Nhập mật khẩu của bạn"
                            onChangeText={(password) => setPassword(password)}
                          />
                          <Pressable
                            onPress={() => setShowPassword((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 items-center justify-center"
                            accessibilityRole="button"
                            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? (
                              <EyeOff className="text-muted-foreground" size={18} />
                            ) : (
                              <Eye className="text-muted-foreground" size={18} />
                            )}
                          </Pressable>
                        </View>
                      </View>
                      <Button 
                        className="w-full text-foreground rounded-lg h-[30px]"
                        onPress={onSignInPress}
                      >
                        <Text className="text-[13px]">
                          {/* Continue */}
                          Tiếp tục
                        </Text>
                      </Button>
                    </View>
                    <View className="flex-row items-center justify-center h-[18px]">
                      <Button 
                        variant="link"
                        onPress={() => setLayout(2)}
                      >
                        <Text className="text-sm text-muted-foreground">
                          {/* Use another method */}
                          Sử dụng phương thức khác
                        </Text>
                      </Button>
                    </View>
                  </View>
                  {}
                </CardContent>
                {/* <CardFooter className="flex-col gap-3 p-0">
                  <View className="flex-row items-center overflow-hidden">
                    <Text className="text-sm text-muted-foreground">
                      Use another method
                    </Text>
                  </View>
                </CardFooter> */}
              </Card>
            </Card>
          </View>
        </>
      ) : layout === 2 ? (
        <>
          <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
            <Card className="w-full p-0 rounded-2xl">
              <Card className="w-full px-10 py-8 gap-9 rounded-2xl rounded-b-lg">{/* max-w-sm */}
                <CardHeader className="justify-center items-center p-0 h-[46px] gap-1">
                  <Text
                    className="w-full text-[17px] leading-6 font-bold text-center"
                    // style={{ lineHeight: 24 }}
                  >
                    {/* Sign in to Waddles */}
                    Sử dụng phương thức khác
                  </Text>
                  <Text
                    className="w-full text-[13px] leading-[18px] text-center m-0"
                    style={{ margin: 0 }}
                  >
                    {/* Welcome back! Please sign in to continue */}
                    Gặp vấn đề? Bạn có thể sử dụng bất kỳ phương thức nào để đăng nhập.
                  </Text>
                </CardHeader>
                <CardContent className="gap-5 p-0">
                  <View className="gap-[6px]">
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
                    <Button variant="outline" className="shadow shadow-foreground/5 flex-1 h-8 rounded-lg">
                      <Text>Email liên kết đến</Text>
                    </Button>
                    <Button variant="outline" className="shadow shadow-foreground/5 flex-1 h-8 rounded-lg py-1">
                      <Text className="">Email mã đến {emailAddress}</Text>
                    </Button>
                  </View>
                  <View className="flex-row items-center justify-center h-[18px]">
                    <Button 
                      // className="p-0"
                      variant="link"
                      onPress={() => setLayout(1)}
                    >
                      <Text className="text-sm text-muted-foreground">
                        {/* Use another method */}
                        Quay lại
                      </Text>
                    </Button>
                  </View>
                  {}
                </CardContent>
              </Card>
              <View className="flex-row justify-center items-center text-center leading-6 px-8 py-4 m-0 gap-1">
                <Text className="flex text-[13px]">
                  {/* Don't have an account? */}
                  Không có bất kỳ phương thức nào?
                </Text>
                <Link href="/sign-up" className="flex font-semibold">
                  <Text className="text-[13px]">
                    {/* Sign up */}
                    Liên hệ hỗ trợ
                  </Text>
                </Link>
              </View>
            </Card>
          </View>
        </>
      ) : layout === 3 ? (
        <>
        </>
      ) : layout === 4 ? (
        <>
        </>
      ) : null}

      {/* <SignIn /> */}

      {/* <View style={styles.container}>
        <Text style={{ color: "red", fontWeight: "bold" }}>DEBUG: Sign In Screen</Text>
        <Text>Sign in</Text>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={onSignInPress}>
          <Text>Continue</Text>
        </TouchableOpacity>
        <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
          <Text>Don"t have an account?</Text>
          <Link href="/sign-up">
            <Text>Sign up</Text>
          </Link>
        </View>
      </View> */}
    </>
  )
}

function SignPassPage() {
  const [password, setPassword] = useState("");

  const onSignInPress = () => {
    // Handle sign-in logic here
  };

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
                Enter your password
              </Text>
              <Text
                className="w-full text-[13px] leading-[18px] text-center m-0"
                style={{ margin: 0 }}
              >
                Enter the password associated with your account
              </Text>
            </CardHeader>
            <CardContent className="gap-6 p-0">
              
              <View className="flex-row gap-[6px] justify-between">
                email@example.com
              </View>
              <View>
                <View className="gap-8">
                  <View className="gap-2">
                    <View className="justify-between">
                      <Text className="text-[13px] leading-[18px]">Password</Text>
                      <Link href="/forgot-password" className="text-[13px] text-blue-500">Forgot password?</Link>
                    </View>
                    <Input
                      // className="h-[30px] px-[12px] py-[6px]"
                      className="h-[30px] px-3 text-[13px] rounded-lg"
                      autoCapitalize="none"
                      value={password}
                      placeholder="Enter your password"
                      onChangeText={(password) => setPassword(password)}
                    />
                  </View>
                  <Button 
                    className="w-full text-foreground rounded-lg h-[30px]"
                    onPress={onSignInPress}
                  >
                    <Text className="text-[13px]">Continue</Text>
                  </Button>
                </View>
              </View>
              {}
            </CardContent>
            <CardFooter className="flex-col gap-3 p-0">
              <View className="flex-row items-center overflow-hidden">
                <Text className="text-sm text-muted-foreground">
                  Use another method
                </Text>
              </View>
            </CardFooter>
          </Card>
          <View className="flex-row justify-center items-center text-center text-[17px] leading-6 px-8 py-4 mx-16 gap-1">
            <Text className="flex">Don't have an account?</Text>
            <Link href="/sign-up" className="flex font-semibold">
              <Text>Sign up</Text>
            </Link>
          </View>
        </Card>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  rootBox: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "stretch",
    gap: "calc(var(--clerk-spacing, 1rem) * 2)",
    backgroundColor: "rgb(33, 33, 38)",
    transitionProperty: "background-color, background, border-color, color, fill, stroke, opacity, box-shadow, transform",
    transitionDuration: "200ms",
    textAlign: "center",
    zIndex: 10,
    borderStyle: "solid",
    borderColor: "color-mix(in srgb, transparent 89%, white)",
    borderRadius: "var(--clerk-border-radius-lg, calc(var(--clerk-border-radius, 0.375rem) * 4 / 3))",
    position: "relative",
    paddingVertical: 32,
    paddingHorizontal: 40,
    marginBlockStart: -1,
    marginInlineStart: -1,
    borderWidth: 0,
    boxShadow: "0px 0px 2px 0px color-mix(in srgb, transparent, var(--clerk-color-shadow, #000000) 8%), 0px 1px 2px 0px color-mix(in srgb, transparent, var(--clerk-color-shadow, #000000) 6%), 0px 0px 0px 1px color-mix(in srgb, transparent, white 3%)",
  },
  h1: {
    boxSizing: "border-box",
    color: "white",
    margin: 0,
    fontFamily: "inherit",
    // letterSpacing:,
    // fontWeight: var(--clerk-font-weight-bold, 700),
    // fontSize: var(--clerk-font-size-lg, calc(var(--clerk-font-size, 0.8125rem) * 17 / 13)),
    lineHeight: 1.41176,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
  },
});
