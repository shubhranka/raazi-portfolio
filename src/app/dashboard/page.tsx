"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  ChevronRight,
  Star,
  Trophy,
  Target,
  BarChart,
  Activity,
  Flame,
  Timer,
  IndianRupee,
  CalendarDaysIcon,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

// This would typically come from a database or API
const userCourses = [
  {
    id: 1,
    name: "Get Rid Of Stifness",
    progress: 60,
    nextClass: "2024-11-20T09:00:00Z",
    booked: false,
    days: "Mon - Fri",
    time: "6:00 AM - 6:40 AM",
    price: 590,
  },
  {
    id: 2,
    name: "Stress Buster",
    progress: 30,
    nextClass: "2024-11-21T18:30:00Z",
    booked: false,
    days: "Mon, Wed, Fri",
    time: "8:00 PM - 8:30 PM",
    price: 390,
  },
  {
    id: 3,
    name: "Mindfulness",
    progress: 80,
    nextClass: "2024-11-22T07:00:00Z",
    booked: false,
    days: "Mon, Wed, Fri",
    time: "7:30 PM - 8:00 PM",
    price: 390,
  },
  {
    id: 4,
    name: "Strenth And Balance",
    progress: 80,
    nextClass: "2024-11-22T07:00:00Z",
    booked: false,
    days: "Mon - Fri",
    time: "5:00 PM - 5:40 PM",
    price: 590,
  },
  // { id: 5, name: "Flexibility", progress: 80, nextClass: "2024-11-22T07:00:00Z" },
  {
    id: 6,
    name: "Burn Lower Abdomen",
    progress: 80,
    nextClass: "2024-11-22T07:00:00Z",
    booked: false,
    days: "Mon - Fri",
    time: "6:40 AM - 7:20 AM",
    price: 590,
  },
  {
    id: 7,
    name: "Facial Yog",
    progress: 80,
    nextClass: "2024-11-22T07:00:00Z",
    booked: false,
    days: "Mon, Wed, Fri",
    time: "4:30 PM - 5:00 PM",
    price: 390,
  },
  {
    id: 8,
    name: "Yog for eye sight",
    progress: 80,
    nextClass: "2024-11-22T07:00:00Z",
    booked: false,
    days: "Mon, Wed, Fri",
    time: "3:00 PM - 3:30 PM",
    price: 390,
  },
  {
    id: 9,
    name: "Suryanamaskar",
    progress: 80,
    nextClass: "2024-11-22T07:00:00Z",
    booked: false,
    days: "Mon - Fri",
    time: "7:00 PM - 7:30 PM",
    price: 530,
  },
  {
    id: 11,
    name: "Pranayama",
    progress: 80,
    nextClass: "2024-11-22T07:00:00Z",
    booked: false,
    days: "Mon, Wed, Fri",
    time: "7:20 AM - 7:40 AM",
    price: 390,
  },
  {
    id: 12,
    name: "Therapeutic Yoga",
    progress: 80,
    nextClass: "2024-11-22T07:00:00Z",
    booked: false,
    days: "Sat, Sun",
    time: "10:30 AM - 12:00 PM",
    price: 6590,
  },
  {
    id: 13,
    name: "She Flows",
    progress: 80,
    nextClass: "2024-11-22T07:00:00Z",
    booked: false,
    days: "Mon - Fri",
    time: "6:00 PM - 7:00 PM",
    price: 1090,
  },
  {
    id: 10,
    name: "Regular",
    progress: 80,
    nextClass: "2024-11-22T07:00:00Z",
    booked: false,
    days: "Mon - Fri",
    time: "5:00 PM - 6:00 AM",
    price: 1090,
  },
];

const classFeedback = [
  {
    id: 1,
    courseName: "Hatha Yoga Fundamentals",
    date: "2024-11-18",
    instructorName: "Abhishita Varma",
    rating: 5,
    comment:
      "Excellent progress in your warrior poses! Your alignment has significantly improved. Keep focusing on your breath during transitions.",
  },
  {
    id: 2,
    courseName: "Vinyasa Flow Intermediate",
    date: "2024-11-17",
    instructorName: "Rajesh Kumar",
    rating: 4,
    comment:
      "Great flow today! Your sun salutations are getting smoother. Work on holding your chaturanga a bit longer for increased strength.",
  },
  {
    id: 3,
    courseName: "Meditation for Beginners",
    date: "2024-11-16",
    instructorName: "Priya Sharma",
    rating: 5,
    comment:
      "Your focus during today's session was impressive. You're making great strides in quieting the mind. Try extending your meditation time gradually.",
  },
];

const achievements = [
  {
    id: 1,
    name: "30-Day Streak",
    icon: Activity,
    description: "Completed 30 consecutive days of practice",
  },
  {
    id: 2,
    name: "Pose Master",
    icon: Trophy,
    description: "Perfected 10 different yoga poses",
  },
  {
    id: 3,
    name: "Zen Master",
    icon: Target,
    description: "Completed 50 hours of meditation",
  },
];

const weeklyProgress = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 60 },
  { day: "Wed", minutes: 30 },
  { day: "Thu", minutes: 45 },
  { day: "Fri", minutes: 0 },
  { day: "Sat", minutes: 90 },
  { day: "Sun", minutes: 60 },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [weeklyGoal, setWeeklyGoal] = useState(300); // 5 hours per week
  const totalMinutes = weeklyProgress.reduce(
    (sum, day) => sum + day.minutes,
    0
  );
  const goalProgress = (totalMinutes / weeklyGoal) * 100;

  const averageSessionLength =
    totalMinutes / weeklyProgress.filter((day) => day.minutes > 0).length;
  const longestSession = Math.max(...weeklyProgress.map((day) => day.minutes));
  const totalSessions = weeklyProgress.filter((day) => day.minutes > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-center bg-white rounded-lg shadow-md p-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20240413-WA0000-KEoVB2XXLvTEgjQS8oPbChADBFa2Mf.jpg"
              alt="RaaziYog Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-teal-800">
              Your Yoga Journey
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Notifications</Button>
            <Avatar className="h-10 w-10 md:h-12 md:w-12">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>YG</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 h-30 sm:h-20 md:h-10">
            <TabsTrigger value="overview" className="text-center">
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="text-center">
              Classes
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-center">
              Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-center">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-center">
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Next Class</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <CalendarDays className="h-10 w-10 text-teal-500" />
                  <div>
                    <p className="text-lg font-semibold text-teal-800">
                      Hatha Yoga Fundamentals
                    </p>
                    <p className="text-sm text-gray-600">
                      Wednesday, Nov 20 • 9:00 AM
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-teal-700 ">Join Class</Button>
              </CardFooter>
            </Card>
           
            {/* <Card>
              <CardHeader>
                <CardTitle>Start Your Yoga Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Image
                    src={"/assets/svg/yoga.svg"}
                    alt="Yoga"
                    width={50}
                    height={50}
                  />
                  <div>
                    <p className="text-lg font-semibold text-teal-800">
                      Please enroll in a class
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-teal-700 hover:bg-teal-600"
                  onClick={() => {
                    setActiveTab("courses");
                  }}
                >
                  Start Now
                </Button>
              </CardFooter>
            </Card> */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Practice Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
                  </div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sessions Completed
                  </CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSessions}</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {userCourses.map((course) => (
                <Card
                  key={course.id}
                  className="bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-teal-700">
                      {course.name}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-3">
                      Next class:{" "}
                      {new Date(course.nextClass).toLocaleString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* <div className="space-y-2"> */}
                    {/* <div className="flex justify-between items-center"> */}
                    {/* <span className="text-sm text-gray-600">Progress</span> */}
                    {/* <span className="text-sm font-medium text-teal-600">{course.progress}%</span> */}
                    {/* </div> */}
                    {/* <Progress value={course.progress} className="h-2 bg-teal-100"/> */}
                    {/* </div> */}
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Timer className="mr-1" /> {course.time}
                        </div>
                        <div className="flex items-center">
                          <CalendarDaysIcon className="mr-1" /> {course.days}
                        </div>
                      </div>
                      <div className="flex items-center text-teal-800 text-xl">
                        <IndianRupee className="mr-1 w-5" />
                        <div className="font-bold">{course.price}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {/* <Button variant="ghost" className="w-full text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                        View Course Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button> */}
                    {!course.booked && (
                      <Link
                        href={`/checkout`}
                        className="w-full"
                      >
                        <Button
                          variant="outline"
                          className="w-full text-teal-600 hover:text-teal-50 hover:bg-teal-700"
                        >
                          Enroll
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Yoga Journey</CardTitle>
                <CardDescription>Track your progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Flexibility</h3>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Strength</h3>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Balance</h3>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Mindfulness</h3>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="shadow-md hover:shadow-lg transition-shadow bg-gray-50"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <achievement.icon className="h-8 w-8 text-gray-400" />
                      </div>
                      <CardTitle className="text-lg text-gray-400">
                        {achievement.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{achievement.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Badge variant="secondary" className="ml-auto">
                      Unachieved
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-teal-700">
                  Recent Class Feedback
                </CardTitle>
                <CardDescription>
                  Feedback from your recent yoga sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {classFeedback.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-teal-800">
                            {feedback.courseName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {feedback.date} • Instructor:{" "}
                            {feedback.instructorName}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < feedback.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm italic">
                        "{feedback.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Feedback
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
