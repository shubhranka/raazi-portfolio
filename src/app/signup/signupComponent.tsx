'use client'

import { useEffect, useRef, useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Phone, MailIcon, Code, Code2, CodeSquare, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import { app, auth } from '@/config/firebase'
import ReCAPTCHA from "react-google-recaptcha";

import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { raazi_yog_tk, raazi_yog_tk_refresh } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import AuthenticationLoadingPage from '@/components/ui/auth-loading'
import { toast } from "sonner"



export default function SignUpComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const [login, setLogin] = useState(true)
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationBox, setVerificationBox] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [code, setCode] = useState('');
  const router = useRouter()
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [numberError, setNumberError] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [authenticating, setAuthenticating] = useState(false)
  const [actualAuthenticating, setActualAuthenticating] = useState(false)
  // const [recaptcha, 
  const captchaContainer = useRef<HTMLDivElement>(null);

  // async function handleCaptchaSubmission(token: string | null) {
  //   try {
  //     if (token) {
  //       await fetch("/api/captcha", {
  //         method: "POST",
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ token }),
  //       });
  //       setIsVerified(true);
  //     }
  //   } catch (e) {
  //     setIsVerified(false);
  //   }
  // }

  const handleTabChange = (tab: string) => {
    setLogin(tab === 'login')
    setVerificationBox(false)
    setConfirmationResult(null)
    setVerificationCode('')
    setName('')
    setEmail('')
    setNumber('')
    setCode('')
  }

  // const handleChange = (token: string | null) => {
  //   handleCaptchaSubmission(token);
  // };

  // function handleExpired() {
  //   setIsVerified(false);
  // }

  // function handleVerify(token: string | null) {
  //   handleCaptchaSubmission(token);
  // }


  const handleSignInSignUp = () => {

    setLoading(true)

    if(!login && !name){
      setNameError('Name is required')
      setLoading(false)
      return
    }
    setNameError('')
    if(!login && !email){
      setEmailError('Email is required')
      setLoading(false)
      return
    }
    setEmailError('')
    if(!number){
      setNumberError('Phone number is required')
      setLoading(false)
      return
    }
    setNumberError('')

    const divElement = document.createElement('div');
    divElement.id = 'recaptcha-container-1';
    captchaContainer.current!.innerHTML = '';
    captchaContainer.current?.appendChild(divElement);
    

    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-1', {
      'size': 'invisible',
      'callback': (value: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit(value);
        
      }
    });
    if (!verificationBox) {

      setVerificationLoading(true)
      signInWithPhoneNumber(auth, `+91${number}`, recaptchaVerifier!).then((confirmationResult: any) => {
        // SMS sent. Confirm the verification process by the user.
        // onSignInSubmit(confirmationResult);
        setVerificationBox(true);
        setConfirmationResult(confirmationResult);
        setVerificationLoading(false)
        setLoading(false)
      }).catch((error: any) => {
        console.log(error);
        if (error.code === 'auth/invalid-phone-number') {
          setNumberError('Invalid phone number')
          setLoading(false)
          
        }
        setVerificationLoading(false)
      })
    }
    else {
      confirmationResult.confirm(code).then((result: any) => {
        setAuthenticating(true)
        fetch(login ? "/api/signin" : "/api/signup", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: login ? JSON.stringify({ token: result.user.accessToken }) : JSON.stringify({ token: result.user.accessToken, name, email }),
        }).then(async (response) => {
          setActualAuthenticating(true)
          if (response.status === 200) {
            const data = await response.json();
            if ((data as any)?.token) {
              localStorage.setItem(raazi_yog_tk, (data as any)?.token);
              localStorage.setItem(raazi_yog_tk_refresh, (data as any)?.refresh_token);
              if (router)
                router.push("/dashboard");
            }
          }else{
            setLogin(false);
            setActualAuthenticating(false);
            setVerificationBox(false);
            setAuthenticating(false)
            setCode('')
            toast.error("Please register")
          }
          setAuthenticating(false)
          setLoading(false)
        }).catch((error: any) => {
          setLogin(false);
          setAuthenticating(false)
          console.log(error);
          setActualAuthenticating(false);
          setLoading(false)
          
        })
      })
    }
  }
  if (actualAuthenticating) {
    return <AuthenticationLoadingPage/>
  }
  function handleKeyDown(event: any): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSignInSignUp();
    }
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
          <Tabs defaultValue="login" className="w-full" onValueChange={handleTabChange} value={login ? 'login' : 'register'}>
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
                      <Input id="phone" placeholder="Enter your phone" type="phone" className="pl-10" onChange={(e) => setNumber(e.target.value)} value={number} onKeyDown={handleKeyDown}/>
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4" />
                    </div>
                    {numberError && <p className="text-sm text-red-500">{numberError}</p>}
                  </div>
                  {verificationBox && <div className="space-y-2">
                    <div className="relative">
                      <Input id="verificationCode" placeholder="Enter your verification code" type="phone" className="pl-10" onChange={(e) => setCode(e.target.value)} value={code}/>
                      <CodeSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4" />
                    </div>
                  </div>}
                  {loading && <Loader2 className="animate-spin" />}
                </div>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-teal-700">Full Name</Label>
                    <div className="relative">
                      <Input id="name" placeholder="Enter your full name" className="pl-10" onChange={(e) => setName(e.target.value)} value={name} />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4" />
                    </div>
                    <small className='text-red-500'>{nameError}</small>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-teal-700">Email</Label>
                    <div className="relative">
                      <Input id="email" placeholder="Enter your Email" type="email" className="pl-10" onChange={(e) => setEmail(e.target.value)} value={email} />
                      <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4" />
                    </div>
                    <small className='text-red-500'>{emailError}</small>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-teal-700">Contact</Label>
                    <div className="relative">
                      <Input id="phone" placeholder="Enter your Contact Number" type="phone" className="pl-10" onChange={(e) => setNumber(e.target.value)} value={number} />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4" />
                    </div>
                    <small className='text-red-500'>{numberError}</small>
                    <div className="flex items-center space-x-2 ml-3">
                      {/* Changed the checked color background when checked */}
                      <Input id="whatsapp" type="checkbox" className="h-3 w-3 checked:ring-teal-500 checked:bg-teal-500 rounded" />

                      {/* <Input id="whatsapp" type="checkbox" className="h-3 w-3 checked:bg-teal-500 " /> */}
                      <Label htmlFor="whatsapp" className="text-teal-700 text-sm">Send me updates via WhatsApp</Label>
                    </div>
                  </div>
                  {verificationLoading && <Loader2 className="animate-spin" />}
                  {verificationBox && <div className="space-y-2">
                    <div className="relative">
                      <Input id="verificationCode" placeholder="Enter your verification code" type="phone" className="pl-10" onChange={(e) => setCode(e.target.value)} value={code}/>
                      <CodeSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-4 w-4" />
                    </div>
                  </div>}
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
          <div ref={captchaContainer} id='recaptcha-container'></div>
          <Button id='sign-in-button' className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSignInSignUp}>
            {/* The button text will change based on the active tab */}
            {/* <Button value="login">Log In</Button>
            <Button value="register">Sign Up</Button> */}
            {login ? "Log In" : "Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}