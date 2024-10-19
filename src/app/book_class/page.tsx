"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Smartphone, Globe } from "lucide-react"

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
    slots.push({ time: `${i}:00`, available: true })
    slots.push({ time: `${i}:30`, available: true })
  }
  return slots
}

const weekdaySlots = generateTimeSlots(5, 8).concat(generateTimeSlots(16, 20))
const weekendSlots = generateTimeSlots(6, 9)

export default function FinalBookSession() {
  const [sessionType, setSessionType] = useState<SessionType>('group')
  const [groupType, setGroupType] = useState<GroupType>('weekday')
  const [individualPlan, setIndividualPlan] = useState<IndividualPlan>('8')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi')
  const [upiId, setUpiId] = useState('')

  const handleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day))
    } else {
      if (individualPlan === '8' && selectedDays.length < 2) {
        setSelectedDays([...selectedDays, day])
      } else if (individualPlan === '16' && selectedDays.length < 4) {
        setSelectedDays([...selectedDays, day])
      } else if (individualPlan === '20') {
        setSelectedDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
      }
    }
  }

  const isTimeSlotAvailable = (time: string) => {
    return true // Simplified for this example
  }

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time)
  }

  const renderPricing = () => {
    if (sessionType === 'group') {
      return groupType === 'weekday' 
        ? "Rs 1500/- for 20 sessions/month (5 sessions/week)" 
        : "Rs 600/- for weekend sessions"
    } else {
      switch (individualPlan) {
        case '8':
          return "Rs 3500/- for 8 sessions/month (2 sessions/week)"
        case '16':
          return "Rs 5200/- for 16 sessions/month (4 sessions/week)"
        case '20':
          return "Rs 7000/- for 20 sessions/month (5 sessions/week)"
        case 'weekend':
          return "Rs 4000/- per month for weekend sessions"
      }
    }
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
            <Tabs defaultValue="group" onValueChange={(value) => setSessionType(value as SessionType)}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="group">Group</TabsTrigger>
                <TabsTrigger value="individual">Individual</TabsTrigger>
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
                      >
                        Weekday
                      </Button>
                      <Button
                        variant={groupType === 'weekend' ? 'default' : 'outline'}
                        onClick={() => setGroupType('weekend')}
                        className="w-full"
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
                          variant="outline"
                          onClick={() => handleDaySelection(day)}
                          className={`w-full text-xs py-1 ${
                            (groupType === 'weekday' && ['Saturday', 'Sunday'].includes(day)) ||
                            (groupType === 'weekend' && !['Saturday', 'Sunday'].includes(day))
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                          disabled={
                            (groupType === 'weekday' && ['Saturday', 'Sunday'].includes(day)) ||
                            (groupType === 'weekend' && !['Saturday', 'Sunday'].includes(day))
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
                        <Button variant="outline" disabled className="w-full text-xs py-1">
                          7:00 AM
                        </Button>
                      ) : (
                        weekendSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? "default" : "outline"}
                            onClick={() => handleTimeSelection(slot.time)}
                            disabled={!isTimeSlotAvailable(slot.time)}
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
                    <Label htmlFor="individual-plan" className="text-gray-700 mb-2 block">Select Your Plan</Label>
                    <Select onValueChange={(value) => setIndividualPlan(value as IndividualPlan)}>
                      <SelectTrigger id="individual-plan">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8 sessions/month (2/week)</SelectItem>
                        <SelectItem value="16">16 sessions/month (4/week)</SelectItem>
                        <SelectItem value="20">20 sessions/month (5/week)</SelectItem>
                        <SelectItem value="weekend">Weekend sessions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-700 mb-2 block">Select Days</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {daysOfWeek.map((day) => (
                        <Button
                          key={day}
                          variant={selectedDays.includes(day) ? "default" : "outline"}
                          onClick={() => handleDaySelection(day)}
                          className={`w-full text-xs py-1 ${
                            (individualPlan === 'weekend' && !['Saturday', 'Sunday'].includes(day)) ||
                            (individualPlan !== 'weekend' && ['Saturday', 'Sunday'].includes(day))
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                          disabled={
                            (individualPlan === 'weekend' && !['Saturday', 'Sunday'].includes(day)) ||
                            (individualPlan !== 'weekend' && ['Saturday', 'Sunday'].includes(day))
                          }
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
              <div>
                <Label className="text-gray-700 text-lg font-semibold">Pricing</Label>
                <p className="text-xl font-bold text-teal-600 mt-1">{renderPricing()}</p>
              </div>
              <div>
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
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50">
            <Button 
              className="w-full bg-teal-500 hover:bg-teal-600 text-white" 
              onClick={() => alert("Booking confirmed!")}
            >
              Confirm Booking
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}