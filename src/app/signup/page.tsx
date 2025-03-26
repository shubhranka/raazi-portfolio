'use client'

import { useRef, useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Phone, MailIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import {app,auth} from '@/config/firebase'
import ReCAPTCHA from "react-google-recaptcha";
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha
} from 'react-google-recaptcha-v3';

import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';



export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [login, setLogin] = useState(true)
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);

  async function handleCaptchaSubmission(token: string | null) {
    try {
      if (token) {
        await fetch("/api/captcha", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
        setIsVerified(true);
      }
    } catch (e) {
      setIsVerified(false);
    }
  }

  const handleChange = (token: string | null) => {
    handleCaptchaSubmission(token);
  };

  function handleExpired() {
    setIsVerified(false);
  }

  function handleVerify(token: string | null) {
    handleCaptchaSubmission(token);
  }

  const handleSignUp = () => {
    const recaptchaVerifier = new RecaptchaVerifier(auth,'sign-in-button', {
      'size': 'invisible',
      'callback': (value:any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit();
        console.log(value)
      }
    });

    signInWithPhoneNumber(auth, "+918319060608",recaptchaVerifier).then((confirmationResult:any) => {
      // SMS sent. Confirm the verification process by the user.
      // onSignInSubmit(confirmationResult);
    })
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20240413-WA0000-KEoVB2XXLvTEgjQS8oPbChADBFa2Mf.jpg"
              alt="RaaziYog Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-teal-800">Welcome to RaaziYog</CardTitle>
          <CardDescription className="text-center text-teal-600">
            Sign up or log in to book your yoga classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full" onValueChange={(value) => setLogin(value === "login")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login"> Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-teal-700">Phone</Label>
                    <div className="relative">
                      <Input id="phone" placeholder="Enter your phone" type="phone" className="pl-10" />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-teal-700">Full Name</Label>
                    <div className="relative">
                      <Input id="name" placeholder="Enter your full name" className="pl-10" />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-teal-700">Email</Label>
                    <div className="relative">
                      <Input id="email" placeholder="Enter your Email" type="email" className="pl-10" />
                      <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-teal-700">Contact</Label>
                    <div className="relative">
                      <Input id="phone" placeholder="Enter your Contact Number" type="phone" className="pl-10" />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4" />
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      {/* Changed the checked color background when checked */}
                      <Input id="whatsapp" type="checkbox" className="h-3 w-3 checked:ring-teal-500 checked:bg-teal-500 rounded" />
                      
                      {/* <Input id="whatsapp" type="checkbox" className="h-3 w-3 checked:bg-teal-500 " /> */}
                      <Label htmlFor="whatsapp" className="text-teal-700 text-sm">Send me updates via WhatsApp</Label>
                    </div>
                  </div>
                  {/* <div className="space-y-2">
                    <GoogleReCaptchaProvider reCaptchaKey={process.env.CAPTCHA_SITE_KEY!}>
                      <GoogleReCaptcha
                          onVerify={handleVerify}
                        />
                    </GoogleReCaptchaProvider>
                  </div> */}
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button id='sign-in-button' className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSignUp}>
            {/* The button text will change based on the active tab */}
            {/* <Button value="login">Log In</Button>
            <Button value="register">Sign Up</Button> */}
            {login ? "Log In" : "Sign Up"}
          </Button>
        </CardFooter>
        <div className="text-center pb-4">
          <a href="#" className="text-sm text-teal-600 hover:underline">Forgot password?</a>
        </div>
      </Card>
    </div>
  )
}