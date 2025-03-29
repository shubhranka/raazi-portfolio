"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  ChevronRight,
  Star,
  Trophy,
  Target,
  Activity,
  Timer,
  IndianRupee,
  CalendarDaysIcon,
  Loader2,
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
import Image from "next/image";
import Link from "next/link";
import { Course } from "@prisma/client";
import { cn } from "@/lib/utils";
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

interface DashboardProps {
  user: string,
  email: string,
  bookedCourses: string[]
}

const daysArray = [ "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

export default function DashboardPage({ user, email, bookedCourses }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [weeklyGoal, setWeeklyGoal] = useState(300); // 5 hours per week
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [bookedCoursesDetails, setBookedCoursesDetails] = useState<any>([]);
  const totalMinutes = weeklyProgress.reduce(
    (sum, day) => sum + day.minutes,
    0
  );
  const goalProgress = (totalMinutes / weeklyGoal) * 100;

  const averageSessionLength =
    totalMinutes / weeklyProgress.filter((day) => day.minutes > 0).length;
  const longestSession = Math.max(...weeklyProgress.map((day) => day.minutes));
  const totalSessions = weeklyProgress.filter((day) => day.minutes > 0).length;
  const firstLettersOfName = user.split(" ").map(name => name[0].toUpperCase()).join("");

  useEffect(() => {
    // Read url, if url has #courses, then set activeTab to "courses"
    const url = new URL(window.location.href);
    const tab = url.hash.replace("#", "");
    if (!tab) setActiveTab("overview");
    else setActiveTab(tab);
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch("/api/get_courses");
      const data = await response.json();
      setUserCourses(data);
      let bookedCoursesDetails = bookedCourses.map((courseId) => {
        const course = data.find((course:any) => course.id === courseId);
        return course;
      });
      bookedCoursesDetails = bookedCoursesDetails.map((course) => {
        const nextClass = new Date();
        while(course?.days.includes(daysArray[nextClass.getDay()])) {
          nextClass.setDate(nextClass.getDate() + 1);
        }
        nextClass.setHours(Number(course.from.hour), Number(course.from.minute), 0, 0);
        return { ...course, nextClass };
      })
      setBookedCoursesDetails(bookedCoursesDetails);
    };
    fetchCourses();
  }, []);

  function handleLogout(): void {
    localStorage.removeItem('raazi_yog_tk')
    localStorage.removeItem('raazi_yog_tk_refresh')
    window.location.href = '/signup'
  }

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
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
            <Avatar className="h-10 w-10 md:h-12 md:w-12">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>{firstLettersOfName}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          {/* <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 h-30 sm:h-20 md:h-10"> */}
          <TabsList className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-2 h-30 sm:h-20 md:h-10">
            <TabsTrigger value="overview" className="text-center">
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="text-center">
              Classes
            </TabsTrigger>
            {/* <TabsTrigger value="progress" className="text-center">
              Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-center">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-center">
              Feedback
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* <Card>
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
            </Card> */}
            {bookedCoursesDetails.map((course : any) => (
              <Card key={course?.id}>
                <CardHeader>
                  <CardTitle>{course?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <CalendarDays className="h-10 w-10 text-teal-500" />
                    <div>
                      <p className="text-lg font-semibold text-teal-800">
                        {course?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {/* Do GMT + 5:30 */}
                        {(course?.nextClass as Date).toString().split('GMT')[0] }
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-teal-700 ">Join Class</Button>
                </CardFooter>
              </Card>
            ))}
           
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

            {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
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
            </div> */}
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {userCourses.length === 0 && <Loader2 className="animate-spin" />}
              {userCourses.map((course) => { 
                // const nextClass = new Date() + 
                return (
                <Card
                  key={course.id}
                  className="bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-teal-700">
                      {course.name}
                    </CardTitle>
                    {/* <CardDescription className="flex flex-col gap-3">
                      Next class:{" "}
                      {new Date(course.nextClass).toLocaleString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </CardDescription> */}
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
                          <Timer className="mr-1" /> {course.from.hour}:{course.from.minute} - {course.to.hour}:{course.to.minute}
                        </div>
                        <div className="flex items-center">
                          <CalendarDaysIcon className="mr-1" /> 
                          <div className="flex gap-3">
                            {makeDaysBulletList(course.days)}
                          </div> 
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
                    {!bookedCourses?.includes(course.id) && (
                      <Link
                        href={`/checkout?courseId=${course.id}`}
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
              )})}
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


const makeDaysBulletList = (days: string[]) => {
  const daysMap = {
    MONDAY:0,
    TUESDAY:1,
    WEDNESDAY:2,
    THURSDAY:3,
    FRIDAY:4,
    SATURDAY:5,
    SUNDAY:6
  }
  const daysArray = [false,false,false,false,false,false,false]
  const daysFirstTwoLeters = ["Mo","Tu","We","Th","Fr","Sa","Su"]
  days.forEach(day => {
    daysArray[daysMap[day as keyof typeof daysMap]] = true
  })
  return daysArray.map((day,index) => <div key={index} className={cn("relative w-3 h-3 bg-gray-200 rounded-full text-xs flex items-center justify-center", day && "bg-teal-700")}> <div className="absolute -bottom-5">{daysFirstTwoLeters[index]}</div> </div>);
}