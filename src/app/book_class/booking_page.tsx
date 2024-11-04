"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"
import { handleCost } from "../actions"
import TimeSlot from "./time_slot"
import { Day, Slot } from "@prisma/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { Redirection } from "./redirection"

type SessionType = 'group' | 'private'
type GroupType = 'weekday' | 'weekend'
type PrivatePlan = '8' | '16' | '20' | 'weekend'
type PaymentMethod = 'upi' | 'card' | 'netbanking'

interface TimeSlot extends Slot {
  time: string
}



export default function FinalBookSession() {
  const [sessionType, setSessionType] = useState<SessionType>('group')
  const [groupType, setGroupType] = useState<GroupType>('weekday')
  const [privatePlan, setprivatePlan] = useState<PrivatePlan>('8')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi')
  const [paymentStarted, setPaymentStarted] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [upiId, setUpiId] = useState('')
  const [totalSelectedWeekdays, setTotalSelectedWeekdays] = useState(0)
  const [totalSelectedWeekends, setTotalSelectedWeekends] = useState(0)
  const [price, setPrice] = useState(0)
  const [sadhaks, setSadhaks] = useState(1)
  const [groupWeekdaySlots, setGroupWeekdaySlots] = useState<TimeSlot[]>([])
  const [groupWeekendSlots, setGroupWeekendSlots] = useState<TimeSlot[]>([])
  const sessions = totalSelectedWeekdays + totalSelectedWeekends
  const [isTimeDialogOpen, setIsTimeDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [phone, setPhone] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const [nameError, setnameError] = useState('')
  const [emailError, setemailError] = useState('')
  const [phoneError, setPhoneError] = useState('')


  const [privateSlots, setPrivateSlots] = useState<TimeSlot[]>([])
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([])
  const [privateSlotsLoading, setPrivateSlotsLoading] = useState(false)


  useEffect(() => {
    handleSetPrice()
    setGroupSlots()
  }, [totalSelectedWeekdays, totalSelectedWeekends, sadhaks])

  const handleSetPrice = async () => {
    setPrice(await handleCost(totalSelectedWeekdays, totalSelectedWeekends, sadhaks))
  }

  const validateInputs = async () => {
    if(name === ''){
      setnameError("Name is required")
      nameRef.current?.focus()
      return false
    }else{
      setnameError('')
    }
    if(email === ''){
      setemailError("Email is required")
      emailRef.current?.focus()
      return false
    }else if (!email.includes('@') || !email.includes('.')){
      setemailError("Invalid Email")
      emailRef.current?.focus()
      return false
    }else{
      setemailError('')
    }
    if(phone === ''){
      setPhoneError("Phone Number is required")
      phoneRef.current?.focus()
      return false
    }else if (phone.length !== 10 || isNaN(Number(phone))){
      setPhoneError("Invalid Phone Number")
      phoneRef.current?.focus()
      return false
    }else{
      setPhoneError('')
    }
    if(selectedSlots.length === 0){
      alert("Please select a time slot")
      return false
    }

    setRedirecting(true)

    const response = await fetch('/api/payment_process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        slots: selectedSlots,
        name,
        email,
        phone
      })
    })

    const {link} = await response.json()

    // Visit the link
    window.open(link,"_self");

  }


  const setGroupSlots = async () => {
    const res = await fetch('/api/groupSlot')
    const data = await res.json()
    setGroupWeekdaySlots(data.weekdaySlots)
    setGroupWeekendSlots(data.weekendSlots)
  }
  if (redirecting) {
    return <Redirection />
  }
  const handleDaySelection = async (day: string) => {

    setPrivateSlotsLoading(true)

    setSelectedDay(day)
    setIsTimeDialogOpen(true)
    if (['Saturday', 'Sunday'].includes(day)) {
      if (selectedDays.includes(day)) {
        setTotalSelectedWeekends(totalSelectedWeekends - 1)
        setSelectedDays(selectedDays.filter(d => d !== day))
      } else {
        if (totalSelectedWeekends < 2) {
          setTotalSelectedWeekends(totalSelectedWeekends + 1)
          setSelectedDays([...selectedDays, day])
        }
      }
    } else {
      if (selectedDays.includes(day)) {
        setTotalSelectedWeekdays(totalSelectedWeekdays - 1)
        setSelectedDays(selectedDays.filter(d => d !== day))
      } else {
        if (totalSelectedWeekdays < 5) {
          setTotalSelectedWeekdays(totalSelectedWeekdays + 1)
          setSelectedDays([...selectedDays, day])
        }
      }
    }

    const response = await fetch(`/api/private_slot/${day.toUpperCase()}`)
    const privateSlots = await response.json();
    setPrivateSlots(privateSlots)
    setPrivateSlotsLoading(false)
  }

  const isTimeSlotAvailable = (id: string, slots: TimeSlot[]) => {
    return slots.find((slot) => slot.id === id)?.available
  }

  const handleDelete = (slot: TimeSlot) => {
    setSelectedSlots(selectedSlots.filter((cslot) => cslot.id !== slot.id))
  }

  const handleTimeSelection = (slot: TimeSlot) => {


    if (selectedSlots.findIndex(cslot => cslot.id === slot.id) !== -1) {
      setSelectedSlots(selectedSlots.filter((cslot) => cslot.id !== slot.id))
      return
    }
    const newSelectedSlots = selectedSlots.filter((cslot) => !(cslot.day == slot.day && cslot.plan == slot.plan))

    newSelectedSlots.push(slot)
    // console.log(newSelectedSlots)
    setSelectedSlots(newSelectedSlots)
    setSelectedDay(null)
    setIsTimeDialogOpen(false)
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-peach-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="backdrop-blur-md bg-white/70 shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-teal-400 to-teal-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">Book Your Yoga Journey</CardTitle>
            <CardDescription className="text-center text-white/80">Find your inner peace with us</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            {/* Take Input for First Name Last Name and phone number */}
            <div>
              <Label htmlFor="first-name" className="text-gray-700">Name</Label>
              <Input required ref={nameRef} id="first-name" placeholder="Enter your name" className="mt-1 bg-white"
                value={name}
                onChange={(e) => setname(e.target.value)} 
               />
               {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
            </div>
            <div>
              <Label htmlFor="last-name" className="text-gray-700">Email</Label>
              <Input required type="email" ref={emailRef} id="last-name" placeholder="Enter your email" className="mt-1 bg-white" 
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
              <Input required type="phone" ref={phoneRef} id="phone" placeholder="Enter your phone number" className="mt-1 bg-white" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {phoneError && <p className="text-red-500 text-xs">{phoneError}</p>}
            </div>
            {/* Take Input for Email */}
            <Tabs defaultValue="group" onValueChange={(value: any) => { setSelectedSlots([]);setSessionType(value as SessionType)}}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger disabled={paymentStarted} value="group">Group</TabsTrigger>
                <TabsTrigger disabled={paymentStarted} value="private">Private</TabsTrigger>
              </TabsList>
              <TabsContent value="group">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 mb-2 block">Select Group Type</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={groupType === 'weekday' ? 'default' : 'outline'}
                        onClick={() => { setSelectedSlots([]); setGroupType('weekday')}}
                        className="w-full"
                        disabled={paymentStarted}
                      >
                        Weekday
                      </Button>
                      <Button
                        variant={groupType === 'weekend' ? 'default' : 'outline'}
                        onClick={() => { setSelectedSlots([]); setGroupType('weekend')}}
                        className="w-full"
                        disabled={paymentStarted}
                      >
                        Weekend
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700 mb-2 block">Select Days</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {daysOfWeek.map((day) => (
                        <Button
                          key={day}
                          variant={sessionType === 'group' ? groupType === 'weekday' ? !['Saturday', 'Sunday'].includes(day) ? "default" : "outline" : ['Saturday', 'Sunday'].includes(day) ? "default" : "outline" : selectedDays.includes(day) ? "default" : "outline"}
                          className={`w-full text-xs py-1 ${(groupType === 'weekday' && ['Saturday', 'Sunday'].includes(day)) ||
                            (groupType === 'weekend' && !['Saturday', 'Sunday'].includes(day))
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                            }`}
                          disabled={
                            (sessionType === 'group') ||
                            // (groupType === 'weekday' && ['Saturday', 'Sunday'].includes(day)) ||
                            // (groupType === 'weekend' && !['Saturday', 'Sunday'].includes(day)) ||
                            (paymentStarted)
                          }
                        >
                          {day.slice(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700 mb-2 block">Time Slot</Label>
                      {/* {groupWeekdaySlots.length !== 0 && <div className="flex h-12 justify-center align-center" ><Spinner /></div>} */}
                    <div className="grid grid-cols-2 gap-2">
                      {groupType === 'weekday' ? (
                        groupWeekdaySlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedSlots.find(cslot => cslot.id === slot.id) ? "default" : "outline"}
                            onClick={() => handleTimeSelection(slot)}
                            disabled={!isTimeSlotAvailable(slot.id,groupWeekdaySlots) || paymentStarted}
                            className="w-full text-xs py-1"
                          >
                            {slot.time}
                          </Button>
                        ))
                      ) : (
                        groupWeekendSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedSlots.find(cslot => cslot.id === slot.id) ? "default" : "outline"}
                            onClick={() => handleTimeSelection(slot)}
                            disabled={!isTimeSlotAvailable(slot.id,groupWeekendSlots) || paymentStarted}
                            className="w-full text-xs py-1"
                          >
                            {slot.time}
                          </Button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="private">
                <div className="space-y-4">
                          <Label className="text-gray-700 mb-2 block">Select Days</Label>
                          <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <Dialog key={day} open={isTimeDialogOpen && selectedDay === day} onOpenChange={(open) => {
                      if (!open) {
                        setIsTimeDialogOpen(false)
                        setSelectedDay(null)
                      }}}>
                      <DialogTrigger asChild >
                          {/* <div className="grid grid-cols-7 gap-2"> */}
                            <Button
                              key={day}
                              variant={selectedSlots.find(slot => slot.day === Day[day.toLocaleUpperCase() as 
                                keyof typeof Day
                              ]) ? "default" : "outline"}
                              onClick={() => handleDaySelection(day)}
                              className={`w-full text-xs py-1`}
                            >
                              {day.slice(0, 3)}
                            </Button>
                          {/* </div> */}
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Select Time for {day}</DialogTitle>
                          <DialogDescription>
                            Choose a time slot for your yoga session on {day}.
                          </DialogDescription>
                        </DialogHeader>
                          {privateSlotsLoading && <div className="h-12" ><Spinner /></div>}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[150px] overflow-y-auto">
                          {!privateSlotsLoading && privateSlots.map((slot) => (
                            <Button
                              key={slot.id}
                              variant={selectedSlots.find(cslot => cslot.id === slot.id) ? "default" : "outline"}
                              onClick={() => handleTimeSelection(slot)}
                              disabled={!isTimeSlotAvailable(slot.id,privateSlots)}
                              className="w-full text-xs py-1"
                            >
                              {slot.time}
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                  </div>
                  { selectedSlots.length > 0 && <div>
                    <Label className="custom-label">Selected Days and Times</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSlots.map((s) => (
                        <div key={s.id} className="bg-white text-accent-foreground rounded-full px-3 py-1 text-xs flex items-center">
                          {s.day.slice(0,3)} {s.time}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-4 w-4 p-0"
                            onClick={() => handleDelete(s)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>}
                </div>
              </TabsContent>
            </Tabs>

            <div className="border-t pt-6 space-y-4">
              {sessions > 0 && sessionType === 'private' && <div>
                <Label className="text-gray-700 text-lg font-semibold">Fees</Label>
                <p className="text-xl font-bold text-teal-600 mt-1">Rs {price} /- </p>
                <p className="text-l font-bold text-teal-600">{sessions * 4} sessions/month - {sessions} sessions/week </p>
                {totalSelectedWeekends > 0 && <p className="text-xs font-bold text-teal-600">*Weekend Charges </p>}
              </div>}
              {sessionType === 'group' && <div>
                <Label className="text-gray-700 text-lg font-semibold">Fees</Label>
                <p className="text-xl font-bold text-teal-600 mt-1"> Rs {groupType === 'weekday' ? 1500 : 600} /- </p>
                <p className="text-l font-bold text-teal-600">{groupType === 'weekday' ? 20 : 8} sessions/month - {groupType === 'weekday' ? 5 : 2} sessions/week </p>
              </div>}
              <div>
                <Button
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white text-lg font-semibold"
                  onClick={validateInputs}
                >
                  {paymentStarted ? "Change Plan" : "Confirm Details"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div >
  )
}