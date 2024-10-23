"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Smartphone, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { handleCost } from "../actions"

type SessionType = 'group' | 'individual'
type GroupType = 'weekday' | 'weekend'
type IndividualPlan = '8' | '16' | '20' | 'weekend'
type PaymentMethod = 'upi' | 'card' | 'netbanking'

interface TimeSlot {
  time: string
  available: boolean
}

const generateTimeSlots = (start: number, end: number): TimeSlot[] => {
  const slots: TimeSlot[] = []
  for (let i = start; i < end; i++) {
    const meridian = i < 12 ? "AM" : "PM"
    const hour = i % 12 || 12
    slots.push({ time: `${hour}:00 ${meridian} - ${hour+1}:00 ${meridian}`, available: true })
  }
  return slots
}

const weekdaySlots = generateTimeSlots(5, 6).concat(generateTimeSlots(7,8)).concat(generateTimeSlots(16, 18)).concat(generateTimeSlots(19, 20))
const weekendSlots = generateTimeSlots(6, 9)
const groupWeekdaySlots = generateTimeSlots(6, 7).concat(generateTimeSlots(18, 19))
const groupWeekendSlots = generateTimeSlots(7, 9)

export default function FinalBookSession() {
  const [sessionType, setSessionType] = useState<SessionType>('group')
  const [groupType, setGroupType] = useState<GroupType>('weekday')
  const [individualPlan, setIndividualPlan] = useState<IndividualPlan>('8')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi')
  const [paymentStarted, setPaymentStarted] = useState(false)
  const [upiId, setUpiId] = useState('')
  const [totalSelectedWeekdays, setTotalSelectedWeekdays] = useState(0)
  const [totalSelectedWeekends, setTotalSelectedWeekends] = useState(0)
  const [price, setPrice] = useState(0)
  const [sadhaks,setSadhaks] = useState(1)
  const sessions = totalSelectedWeekdays + totalSelectedWeekends

  const handleSetPrice = async () => {
    setPrice(await handleCost(totalSelectedWeekdays, totalSelectedWeekends, sadhaks))
  }

  useEffect(() => {
    handleSetPrice()
  },[totalSelectedWeekdays, totalSelectedWeekends, sadhaks])


  const handleDaySelection = (day: string) => {

    if (['Saturday','Sunday'].includes(day)) {
      if (selectedDays.includes(day)) {
        setTotalSelectedWeekends(totalSelectedWeekends - 1)
        setSelectedDays(selectedDays.filter(d => d !== day))
      }else{
        if(totalSelectedWeekends < 2){
          setTotalSelectedWeekends(totalSelectedWeekends + 1)
          setSelectedDays([...selectedDays, day])
        }
      }
    }else{
      if (selectedDays.includes(day)) {
        setTotalSelectedWeekdays(totalSelectedWeekdays - 1)
        setSelectedDays(selectedDays.filter(d => d !== day))
      }else{
        if(totalSelectedWeekdays < 5){
          setTotalSelectedWeekdays(totalSelectedWeekdays + 1)
          setSelectedDays([...selectedDays, day])
        }
      }
    }
  }

  const isTimeSlotAvailable = (time: string) => {
    return true // Simplified for this example
  }

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time)
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
              <Label htmlFor="first-name" className="text-gray-700">First Name</Label>
              <Input id="first-name" placeholder="Enter your first name" className="mt-1 bg-white" />
            </div>
            <div>
              <Label htmlFor="last-name" className="text-gray-700">Last Name</Label>
              <Input id="last-name" placeholder="Enter your last name" className="mt-1 bg-white" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
              <Input id="phone" placeholder="Enter your phone number" className="mt-1 bg-white" />
            </div>
            {/* Take Input for Email */}
            <Tabs defaultValue="group" onValueChange={(value:any) => setSessionType(value as SessionType)}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger disabled={paymentStarted} value="group">Group</TabsTrigger>
                <TabsTrigger disabled={paymentStarted} value="individual">Individual</TabsTrigger>
              </TabsList>
              <TabsContent value="group">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 mb-2 block">Select Group Type</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={groupType === 'weekday' ? 'default' : 'outline'}
                        onClick={() => setGroupType('weekday')}
                        className="w-full"
                        disabled={paymentStarted}
                      >
                        Weekday
                      </Button>
                      <Button
                        variant={groupType === 'weekend' ? 'default' : 'outline'}
                        onClick={() => setGroupType('weekend')}
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
                          onClick={() => handleDaySelection(day)}
                          className={`w-full text-xs py-1 ${
                            (groupType === 'weekday' && ['Saturday', 'Sunday'].includes(day)) ||
                            (groupType === 'weekend' && !['Saturday', 'Sunday'].includes(day))
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                          disabled={
                            (groupType === 'weekday' && ['Saturday', 'Sunday'].includes(day)) ||
                            (groupType === 'weekend' && !['Saturday', 'Sunday'].includes(day)) ||
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
                    <div className="grid grid-cols-3 gap-2">
                      {groupType === 'weekday' ? (
                        // <Button variant="default" disabled className="w-full text-xs py-1">
                        //   7:00 AM - 8:00 AM
                        // </Button>
                        groupWeekdaySlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? "default" : "outline"}
                            onClick={() => handleTimeSelection(slot.time)}
                            disabled={!isTimeSlotAvailable(slot.time) || paymentStarted}
                            className="w-full text-xs py-1"
                          >
                            {slot.time}
                          </Button>
                        ))
                      ) : (
                        groupWeekendSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? "default" : "outline"}
                            onClick={() => handleTimeSelection(slot.time)}
                            disabled={!isTimeSlotAvailable(slot.time) || paymentStarted}
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
              <TabsContent value="individual">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 mb-2 block">Select Days</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {daysOfWeek.map((day) => (
                        <Button
                          key={day}
                          variant={selectedDays.includes(day) ? "default" : "outline"}
                          onClick={() => handleDaySelection(day)}
                          className={`w-full text-xs py-1`}
                        >
                          {day.slice(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700 mb-2 block">Select Time Slot</Label>
                    <div className="grid grid-cols-3 gap-2 max-h-[150px] overflow-y-auto">
                      {(individualPlan === 'weekend' ? weekendSlots : weekdaySlots).map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          onClick={() => handleTimeSelection(slot.time)}
                          disabled={!isTimeSlotAvailable(slot.time)}
                          className="w-full text-xs py-1"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="border-t pt-6 space-y-4">
              {sessions>0 && sessionType === 'individual' && <div>
                <Label className="text-gray-700 text-lg font-semibold">Fees</Label>
                <p className="text-xl font-bold text-teal-600 mt-1">Rs {price} /- </p>
                <p className="text-l font-bold text-teal-600">{sessions*4} sessions/month - {sessions} sessions/week </p>
                { totalSelectedWeekends>0 && <p className="text-xs font-bold text-teal-600">*Weekend Charges </p>}
              </div>}
              {sessionType === 'group' && <div>
                <Label className="text-gray-700 text-lg font-semibold">Fees</Label>
                <p className="text-xl font-bold text-teal-600 mt-1"> Rs {groupType === 'weekday' ? 1500 : 600 } /- </p>
                <p className="text-l font-bold text-teal-600">{groupType === 'weekday' ? 20 : 8 } sessions/month - {groupType === 'weekday' ? 5 : 2 } sessions/week </p>
              </div>}
              <div>
                <Button 
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white text-lg font-semibold" 
                  onClick={() => setPaymentStarted(!paymentStarted)}
                >
                  {paymentStarted ? "Change Plan" : "Proceed to Payment"}
                </Button>
              </div>

              <div className={cn(
                "space-y-4",
                paymentStarted ? "block" : "hidden"
              )}>
                <Label className="text-gray-700 text-lg font-semibold mb-2 block">Payment Options</Label>
                <div className="space-y-2">
                  {[
                    { value: 'upi', label: 'UPI Payment', icon: Smartphone },
                    { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                    { value: 'netbanking', label: 'Net Banking', icon: Globe }
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={paymentMethod === option.value ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setPaymentMethod(option.value as PaymentMethod)}
                    >
                      <option.icon className="mr-2 h-4 w-4" />
                      {option.label}
                    </Button>
                  ))}
                </div>
              {paymentMethod === 'upi' && (
                <div>
                  <Label htmlFor="upi-id" className="text-gray-700">UPI ID</Label>
                  <Input 
                    id="upi-id" 
                    placeholder="Enter your UPI ID" 
                    className="mt-1"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              )}
              <div>
            <Button 
              className="w-full bg-teal-500 hover:bg-teal-600 text-white" 
              onClick={() => alert("Booking confirmed!")}
            >
              Confirm Booking
            </Button>
          </div>  
            </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}