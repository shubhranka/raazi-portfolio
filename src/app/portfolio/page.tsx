"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Star, Feather, Sun, Moon, Wind, Menu } from "lucide-react"

export default function ModernYogaTeacherPortfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20240413-WA0000-KEoVB2XXLvTEgjQS8oPbChADBFa2Mf.jpg" alt="Yoga Logo" className="w-10 h-10 mr-2" />
            <h1 className="text-2xl font-bold text-teal-800">Serene Yoga</h1>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {["About", "Services", "Testimonials", "Contact"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-teal-700 hover:text-teal-900 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            className="md:hidden"
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden bg-white/95 backdrop-blur-md">
            <ul className="py-4">
              {["About", "Services", "Testimonials", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="block py-2 px-4 text-teal-700 hover:bg-teal-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main>
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20240413-WA0000-KEoVB2XXLvTEgjQS8oPbChADBFa2Mf.jpg"
              alt=""
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          <div className="relative z-10 text-center px-4">
            <h2 className="text-5xl md:text-7xl font-bold text-teal-900 mb-6 animate-fade-in-up">
              Find Your Inner Balance
            </h2>
            <p className="text-xl md:text-2xl text-teal-700 mb-10 animate-fade-in-up animation-delay-200">
              Join me on a journey to harmonize mind, body, and spirit
            </p>
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white transition-colors animate-fade-in-up animation-delay-400"
            >
              Book a Session
            </Button>
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="relative">
                  <img
                    src="/placeholder.svg?height=500&width=500"
                    alt="Yoga teacher in a pose"
                    className="rounded-full mx-auto shadow-2xl"
                    width={500}
                    height={500}
                  />
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-peach-200 rounded-full flex items-center justify-center animate-float">
                    <Sun className="w-12 h-12 text-teal-600" />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-teal-200 rounded-full flex items-center justify-center animate-float animation-delay-500">
                    <Moon className="w-12 h-12 text-teal-600" />
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h2 className="text-4xl font-bold text-teal-900 mb-6">About Me</h2>
                <p className="text-teal-700 mb-6 text-lg">
                  Hello, I'm Sarah, a certified yoga instructor with over 10 years of experience. My journey into yoga began as a way to find balance in my hectic life, and it has since become my passion and calling.
                </p>
                <p className="text-teal-700 mb-8 text-lg">
                  I specialize in Hatha and Vinyasa yoga, and I'm dedicated to helping my students find peace, strength, and flexibility both on and off the mat.
                </p>
                <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-100 transition-colors">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-teal-900 mb-12 text-center">My Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Private Sessions', icon: Heart, description: 'One-on-one personalized yoga sessions tailored to your needs and goals.' },
                { title: 'Group Classes', icon: Feather, description: 'Energizing group classes for all levels, fostering a sense of community and shared growth.' },
                { title: 'Corporate Wellness', icon: Wind, description: 'Bring the benefits of yoga to your workplace with custom corporate wellness programs.' }
              ].map((service, index) => (
                <Card key={index} className="bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <service.icon className="w-8 h-8 text-teal-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-teal-900 mb-4 text-center">{service.title}</h3>
                    <p className="text-teal-700 text-center">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 bg-teal-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-teal-900 mb-12 text-center">What My Students Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: "Emily R.", text: "Sarah's classes have transformed my practice. Her gentle guidance and deep knowledge make every session a joy." },
                { name: "Michael T.", text: "As a beginner, I was intimidated by yoga, but Sarah's patient teaching style made me feel comfortable and confident." }
              ].map((testimonial, index) => (
                <Card key={index} className="bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <CardContent className="p-8">
                    <div className="flex mb-6 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-teal-700 mb-6 text-lg italic text-center">&ldquo;{testimonial.text}&rdquo;</p>
                    <p className="font-semibold text-teal-900 text-center">{testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-teal-900 mb-12 text-center">Get in Touch</h2>
            <form className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-xl">
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-teal-700 mb-2">Name</label>
                <Input id="name" placeholder="Your name" className="border-teal-300 focus:border-teal-500 focus:ring-teal-500" />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-teal-700 mb-2">Email</label>
                <Input id="email" type="email" placeholder="Your email" className="border-teal-300 focus:border-teal-500 focus:ring-teal-500" />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-teal-700 mb-2">Message</label>
                <Textarea id="message" placeholder="Your message" className="border-teal-300 focus:border-teal-500 focus:ring-teal-500" rows={4} />
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-colors">Send Message</Button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-teal-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20240413-WA0000-KEoVB2XXLvTEgjQS8oPbChADBFa2Mf.jpg" alt="Yoga Logo" className="w-12 h-12 mb-2" />
              <p>&copy; {new Date().getFullYear()} Serene Yoga. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              {["Facebook", "Instagram", "Twitter"].map((social) => (
                <a key={social} href="#" className="hover:text-teal-200 transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}