import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Car, CheckCircle, ArrowRight, ArrowLeft, Star, User, MapPin, DollarSign, Fuel } from 'lucide-react'
import carDatabase from './carDatabase.js'
import './App.css'

function App() {
  const [currentStage, setCurrentStage] = useState(0) // 0: Welcome, 1: Stage 1, 2: Stage 2, 3: Stage 3, 4: Results
  const [answers, setAnswers] = useState({})
  const [topCars, setTopCars] = useState([])
  const [finalRecommendation, setFinalRecommendation] = useState(null)

  const stage1Questions = [
    {
      id: "gender",
      question: "What is your gender?",
      type: "radio",
      icon: <User className="h-5 w-5" />,
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Non-binary", label: "Non-binary" },
        { value: "Prefer not to say", label: "Prefer not to say" }
      ]
    },
    {
      id: "ageGroup",
      question: "What is your age group?",
      type: "radio",
      icon: <User className="h-5 w-5" />,
      options: [
        { value: "Under 18", label: "Under 18" },
        { value: "18-24", label: "18-24" },
        { value: "25-34", label: "25-34" },
        { value: "35-44", label: "35-44" },
        { value: "45-54", label: "45-54" },
        { value: "55-64", label: "55-64" },
        { value: "65+", label: "65+" }
      ]
    },
    {
      id: "drivingExperience",
      question: "How would you describe your driving experience?",
      type: "radio",
      icon: <Car className="h-5 w-5" />,
      options: [
        { value: "Novice", label: "Novice (less than 2 years)" },
        { value: "Experienced", label: "Experienced (2-10 years)" },
        { value: "Veteran", label: "Veteran (more than 10 years)" }
      ]
    },
    {
      id: "locationType",
      question: "What best describes your primary location?",
      type: "radio",
      icon: <MapPin className="h-5 w-5" />,
      options: [
        { value: "Urban/City", label: "Urban/City" },
        { value: "Suburban", label: "Suburban" },
        { value: "Rural", label: "Rural" },
        { value: "Mixed", label: "Mixed" }
      ]
    },
    {
      id: "purchaseType",
      question: "Are you looking for a new or used car?",
      type: "radio",
      icon: <DollarSign className="h-5 w-5" />,
      options: [
        { value: "New Car", label: "New Car" },
        { value: "Used Car", label: "Used Car" }
      ]
    },
    {
      id: "usedCarAge",
      question: "If used car, what age range do you prefer?",
      type: "radio",
      icon: <DollarSign className="h-5 w-5" />,
      options: [
        { value: "1-2 years old", label: "1-2 years old" },
        { value: "3-5 years old", label: "3-5 years old" },
        { value: "6-10 years old", label: "6-10 years old" },
        { value: "10+ years old", label: "10+ years old" }
      ],
      conditional: { dependsOn: "purchaseType", value: "Used Car" }
    },
    {
      id: "budget",
      question: "What is your budget range (total purchase price)?",
      type: "radio",
      icon: <DollarSign className="h-5 w-5" />,
      options: [
        { value: "Under $15,000", label: "Under $15,000" },
        { value: "$15,000 - $25,000", label: "$15,000 - $25,000" },
        { value: "$25,000 - $40,000", label: "$25,000 - $40,000" },
        { value: "$40,000 - $60,000", label: "$40,000 - $60,000" },
        { value: "$60,000 - $80,000", label: "$60,000 - $80,000" },
        { value: "Over $80,000", label: "Over $80,000" }
      ]
    },
    {
      id: "primaryUse",
      question: "What will be the primary use of the car?",
      type: "radio",
      icon: <Car className="h-5 w-5" />,
      options: [
        { value: "Daily Commute", label: "Daily Commute" },
        { value: "Family Transport", label: "Family Transport" },
        { value: "Business/Work", label: "Business/Work" },
        { value: "Recreational/Adventure", label: "Recreational/Adventure" },
        { value: "Performance Driving", label: "Performance Driving" }
      ]
    },
    {
      id: "passengers",
      question: "How many passengers do you typically carry?",
      type: "radio",
      icon: <User className="h-5 w-5" />,
      options: [
        { value: "1-2", label: "1-2 passengers" },
        { value: "3-4", label: "3-4 passengers" },
        { value: "5+", label: "5+ passengers" },
        { value: "Often carry pets", label: "Often carry pets" }
      ]
    },
    {
      id: "bodyStyle",
      question: "Do you have a preferred body style?",
      type: "radio",
      icon: <Car className="h-5 w-5" />,
      options: [
        { value: "Sedan", label: "Sedan" },
        { value: "SUV/Crossover", label: "SUV/Crossover" },
        { value: "Truck", label: "Truck" },
        { value: "Hatchback", label: "Hatchback" },
        { value: "Minivan", label: "Minivan" },
        { value: "Coupe/Sports Car", label: "Coupe/Sports Car" },
        { value: "Wagon", label: "Wagon" }
      ]
    },
    {
      id: "fuelType",
      question: "What is your preferred fuel type?",
      type: "radio",
      icon: <Fuel className="h-5 w-5" />,
      options: [
        { value: "Gasoline", label: "Gasoline" },
        { value: "Diesel", label: "Diesel" },
        { value: "Full Hybrid (HEV)", label: "Full Hybrid (HEV)" },
        { value: "Plug-in Hybrid (PHEV)", label: "Plug-in Hybrid (PHEV)" },
        { value: "Battery Electric (BEV)", label: "Battery Electric (BEV)" },
        { value: "LPG/GPL", label: "LPG/GPL" },
        { value: "Hydrogen Fuel Cell (FCEV)", label: "Hydrogen Fuel Cell (FCEV)" },
        { value: "No Strong Preference", label: "No Strong Preference" }
      ]
    },
    {
      id: "currentCar",
      question: "What is your current or most recent car? (Make, Model, Year)",
      type: "text",
      icon: <Car className="h-5 w-5" />
    }
  ]

  const stage2Questions = [
    {
      id: "mustHaveFeatures",
      question: "What are your top 3 must-have features?",
      type: "textarea",
      icon: <CheckCircle className="h-5 w-5" />,
      placeholder: "e.g., Advanced Driver-Assistance Systems (ADAS), specific infotainment system, premium sound, panoramic sunroof, heated/ventilated seats, remote start..."
    },
    {
      id: "dealBreakerFeatures",
      question: "Are there any absolute deal-breaker features or options?",
      type: "textarea",
      icon: <CheckCircle className="h-5 w-5" />,
      placeholder: "e.g., Manual transmission, cloth seats, lack of Apple CarPlay/Android Auto..."
    },
    {
      id: "drivingPreference",
      question: "What is your driving preference?",
      type: "radio",
      icon: <Car className="h-5 w-5" />,
      options: [
        { value: "Smooth & Comfortable", label: "Smooth & Comfortable" },
        { value: "Balanced Performance", label: "Balanced Performance" },
        { value: "Sporty & Agile", label: "Sporty & Agile" },
        { value: "Rugged Off-road Capability", label: "Rugged Off-road Capability" }
      ]
    },
    {
      id: "enginePowerImportance",
      question: "How important is engine power to you?",
      type: "radio",
      icon: <Car className="h-5 w-5" />,
      options: [
        { value: "Low", label: "Low - Fuel efficiency is more important" },
        { value: "Moderate", label: "Moderate - Balanced approach" },
        { value: "High", label: "High - I want strong acceleration" }
      ]
    },
    {
      id: "brandImportance",
      question: "How important is brand reputation/prestige to you?",
      type: "radio",
      icon: <Star className="h-5 w-5" />,
      options: [
        { value: "Very Important", label: "Very Important" },
        { value: "Moderately Important", label: "Moderately Important" },
        { value: "Less Important", label: "Less Important" }
      ]
    },
    {
      id: "reliabilityVsInnovation",
      question: "Do you prioritize proven reliability or are you willing to embrace new technology/brands?",
      type: "radio",
      icon: <CheckCircle className="h-5 w-5" />,
      options: [
        { value: "Proven Reliability", label: "Prioritize proven reliability" },
        { value: "Balanced", label: "Balanced approach" },
        { value: "New Technology", label: "Willing to embrace new technology/brands" }
      ]
    }
  ]

  const stage3Questions = [
    {
      id: "testDriveImpression",
      question: "Imagine you've test-driven these cars. Which felt most comfortable and intuitive?",
      type: "radio",
      icon: <Car className="h-5 w-5" />,
      options: [] // Will be populated with top 3 cars
    },
    {
      id: "specificScenario",
      question: "Consider your most frequent or challenging driving scenario. Which of these cars best addresses that scenario?",
      type: "radio",
      icon: <MapPin className="h-5 w-5" />,
      options: [] // Will be populated with top 3 cars
    },
    {
      id: "longTermOwnership",
      question: "Looking 3-5 years down the road, which car do you envision yourself being most satisfied with?",
      type: "radio",
      icon: <Star className="h-5 w-5" />,
      options: [] // Will be populated with top 3 cars
    },
    {
      id: "emotionalConnection",
      question: "Beyond the practicalities, which car truly excites you or feels like 'the one'? What is it about that car that creates this emotional connection?",
      type: "textarea",
      icon: <Star className="h-5 w-5" />,
      placeholder: "Describe what appeals to you most about your preferred choice and why it resonates with you emotionally..."
    }
  ]

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const filterCarsStage1 = () => {
    let filtered = [...carDatabase]

    // Filter by demographics
    if (answers.gender && answers.gender !== "Prefer not to say") {
      filtered = filtered.filter(car => 
        car.demographics.gender.includes(answers.gender)
      )
    }

    if (answers.ageGroup) {
      filtered = filtered.filter(car => 
        car.demographics.ageGroup.includes(answers.ageGroup)
      )
    }

    if (answers.drivingExperience) {
      filtered = filtered.filter(car => 
        car.demographics.drivingExperience.includes(answers.drivingExperience)
      )
    }

    // Filter by location type
    if (answers.locationType) {
      filtered = filtered.filter(car => 
        car.locationType.includes(answers.locationType)
      )
    }

    // Filter by budget
    if (answers.budget) {
      const priceKey = answers.purchaseType === "New Car" ? "new" : 
                      answers.usedCarAge === "1-2 years old" ? "used_1_year" :
                      answers.usedCarAge === "3-5 years old" ? "used_3_year" :
                      "used_5_year"
      
      filtered = filtered.filter(car => {
        const price = car.price[priceKey] || car.price.new
        switch (answers.budget) {
          case "Under $15,000":
            return price < 15000
          case "$15,000 - $25,000":
            return price >= 15000 && price <= 25000
          case "$25,000 - $40,000":
            return price >= 25000 && price <= 40000
          case "$40,000 - $60,000":
            return price >= 40000 && price <= 60000
          case "$60,000 - $80,000":
            return price >= 60000 && price <= 80000
          case "Over $80,000":
            return price > 80000
          default:
            return true
        }
      })
    }

    // Filter by body style
    if (answers.bodyStyle) {
      filtered = filtered.filter(car => car.bodyStyle === answers.bodyStyle)
    }

    // Filter by fuel type
    if (answers.fuelType && answers.fuelType !== "No Strong Preference") {
      filtered = filtered.filter(car => car.fuelType === answers.fuelType)
    }

    // Filter by passengers
    if (answers.passengers) {
      filtered = filtered.filter(car => car.passengers === answers.passengers)
    }

    // Sort by relevance (could be enhanced with more sophisticated scoring)
    filtered.sort((a, b) => {
      let scoreA = 0, scoreB = 0
      
      // Boost score for matching performance preference
      if (answers.drivingPreference && a.performance === answers.drivingPreference) scoreA += 2
      if (answers.drivingPreference && b.performance === answers.drivingPreference) scoreB += 2
      
      return scoreB - scoreA
    })

    return filtered.slice(0, 7) // Return top 7 for stage 1
  }

  const filterCarsStage2 = () => {
    let filtered = [...topCars]

    // Apply stage 2 filtering based on detailed preferences
    if (answers.drivingPreference) {
      filtered = filtered.filter(car => car.performance === answers.drivingPreference)
    }

    // Sort by additional criteria and take top 5
    return filtered.slice(0, 5)
  }

  const filterCarsStage3 = () => {
    // Return top 3 from stage 2 results
    return filterCarsStage2().slice(0, 3)
  }

  const selectFinalCar = () => {
    const top3 = filterCarsStage3()
    
    // Prioritize based on stage 3 answers
    if (answers.testDriveImpression) {
      const selectedIndex = parseInt(answers.testDriveImpression)
      return top3[selectedIndex]
    }
    
    if (answers.longTermOwnership) {
      const selectedIndex = parseInt(answers.longTermOwnership)
      return top3[selectedIndex]
    }
    
    return top3[0] // Default to first car
  }

  const nextStage = () => {
    if (currentStage === 1) {
      const filtered = filterCarsStage1()
      setTopCars(filtered)
    } else if (currentStage === 2) {
      const filtered = filterCarsStage2()
      setTopCars(filtered)
      
      // Update stage 3 questions with actual car options
      const top3 = filtered.slice(0, 3)
      stage3Questions[0].options = top3.map((car, index) => ({
        value: index.toString(),
        label: `${car.make} ${car.model}`
      }))
      stage3Questions[1].options = top3.map((car, index) => ({
        value: index.toString(),
        label: `${car.make} ${car.model}`
      }))
      stage3Questions[2].options = top3.map((car, index) => ({
        value: index.toString(),
        label: `${car.make} ${car.model}`
      }))
    } else if (currentStage === 3) {
      const finalCar = selectFinalCar()
      setFinalRecommendation(finalCar)
    }
    
    setCurrentStage(prev => prev + 1)
  }

  const prevStage = () => {
    setCurrentStage(prev => prev - 1)
  }

  const shouldShowQuestion = (question) => {
    if (!question.conditional) return true
    return answers[question.conditional.dependsOn] === question.conditional.value
  }

  const renderQuestion = (question, stageQuestions) => {
    if (!shouldShowQuestion(question)) return null
    
    const currentAnswer = answers[question.id] || ""

    return (
      <Card key={question.id} className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {question.icon}
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {question.type === "radio" && (
            <RadioGroup
              value={currentAnswer}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
          {question.type === "text" && (
            <Input
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Enter your answer..."
            />
          )}
          {question.type === "textarea" && (
            <Textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder={question.placeholder || "Enter your answer..."}
              rows={3}
            />
          )}
        </CardContent>
      </Card>
    )
  }

  const renderCarCard = (car, index) => {
    const priceKey = answers.purchaseType === "New Car" ? "new" : 
                    answers.usedCarAge === "1-2 years old" ? "used_1_year" :
                    answers.usedCarAge === "3-5 years old" ? "used_3_year" :
                    "used_5_year"
    const price = car.price[priceKey] || car.price.new

    return (
      <Card key={car.id} className="mb-4 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            {car.make} {car.model} ({car.year})
          </CardTitle>
          <CardDescription className="text-lg font-semibold text-green-600">
            ${price.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Body Style</p>
              <p className="font-medium">{car.bodyStyle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fuel Type</p>
              <p className="font-medium">{car.fuelType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Performance</p>
              <p className="font-medium">{car.performance}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Passengers</p>
              <p className="font-medium">{car.passengers}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {car.features.map((feature) => (
              <Badge key={feature} variant="secondary">{feature}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStageTitle = () => {
    switch (currentStage) {
      case 0: return "Welcome"
      case 1: return "Stage 1: Comprehensive Assessment"
      case 2: return "Stage 2: Detailed Preferences"
      case 3: return "Stage 3: Final Selection"
      case 4: return "Your Perfect Car"
      default: return ""
    }
  }

  const isStageComplete = () => {
    if (currentStage === 1) {
      const requiredFields = ['gender', 'ageGroup', 'drivingExperience', 'locationType', 'purchaseType', 'budget', 'primaryUse', 'passengers', 'bodyStyle', 'fuelType']
      return requiredFields.every(field => answers[field])
    }
    if (currentStage === 2) {
      const requiredFields = ['drivingPreference', 'enginePowerImportance', 'brandImportance', 'reliabilityVsInnovation']
      return requiredFields.every(field => answers[field])
    }
    if (currentStage === 3) {
      return answers.testDriveImpression || answers.longTermOwnership
    }
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Car className="h-10 w-10 text-blue-600" />
            Intelligent Car Recommendation Agent
          </h1>
          <p className="text-lg text-gray-600">Find your perfect car through our expert questioning methodology</p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-4">
            {[1, 2, 3, 4].map((stage) => (
              <div key={stage} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStage >= stage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStage > stage ? <CheckCircle className="h-4 w-4" /> : stage}
                </div>
                {stage < 4 && <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />}
              </div>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            {getStageTitle()}
          </div>
        </div>

        {/* Welcome Stage */}
        {currentStage === 0 && (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Your Intelligent Car Recommendation Journey</CardTitle>
              <CardDescription className="text-lg">
                I'm your expert car advisor with decades of experience and access to comprehensive automotive data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-700">
                Through our sophisticated three-stage questioning methodology, I'll understand your unique demographic profile, 
                lifestyle preferences, and specific requirements to recommend the ideal car for you. We'll progressively narrow 
                down from our comprehensive database to find your perfect match.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Stage 1: Comprehensive Assessment</h3>
                  <p className="text-sm text-gray-600">Demographic profiling and basic requirements to narrow to top 5-7 cars</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Stage 2: Detailed Preferences</h3>
                  <p className="text-sm text-gray-600">Feature preferences and performance requirements to select top 3-5 finalists</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Stage 3: Final Selection</h3>
                  <p className="text-sm text-gray-600">Emotional connection and long-term vision to find your perfect car</p>
                </div>
              </div>
              <Button onClick={nextStage} size="lg" className="px-8">
                Start Your Car Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stage 1: Comprehensive Assessment */}
        {currentStage === 1 && (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Stage 1: Comprehensive Initial Assessment</CardTitle>
                <CardDescription>
                  Let's gather your demographic profile and basic requirements to narrow down to your top 5-7 car options.
                </CardDescription>
              </CardHeader>
            </Card>
            
            {stage1Questions.map((question) => renderQuestion(question, stage1Questions))}
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStage}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={nextStage} disabled={!isStageComplete()}>
                Continue to Stage 2
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Stage 2: Detailed Preferences */}
        {currentStage === 2 && (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Stage 2: Your Top Cars & Detailed Preferences</CardTitle>
                <CardDescription>
                  Based on your profile, here are your top car recommendations. Now let's refine to your top 3-5 finalists.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Your Top {topCars.length} Car Recommendations:</h3>
              {topCars.map((car, index) => renderCarCard(car, index))}
            </div>
            
            {stage2Questions.map((question) => renderQuestion(question, stage2Questions))}
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStage}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={nextStage} disabled={!isStageComplete()}>
                Continue to Final Selection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Stage 3: Final Selection */}
        {currentStage === 3 && (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Stage 3: Final Selection from Your Top 3</CardTitle>
                <CardDescription>
                  These are your final 3 car options. Let's find the one that truly resonates with you.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Your Top 3 Finalists:</h3>
              {filterCarsStage3().map((car, index) => renderCarCard(car, index))}
            </div>
            
            {stage3Questions.map((question) => renderQuestion(question, stage3Questions))}
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStage}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={nextStage} disabled={!isStageComplete()}>
                Get My Perfect Car
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Results Stage */}
        {currentStage === 4 && finalRecommendation && (
          <div>
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3 text-green-800">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  Your Perfect Car Match!
                </CardTitle>
                <CardDescription className="text-lg text-green-700">
                  Based on our comprehensive analysis, here's your ideal vehicle:
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Car className="h-8 w-8 text-green-600" />
                  {finalRecommendation.make} {finalRecommendation.model} ({finalRecommendation.year})
                </CardTitle>
                <CardDescription className="text-xl font-semibold text-green-600">
                  ${(finalRecommendation.price[answers.purchaseType === "New Car" ? "new" : "used_3_year"] || finalRecommendation.price.new).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Body Style</p>
                    <p className="font-medium">{finalRecommendation.bodyStyle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fuel Type</p>
                    <p className="font-medium">{finalRecommendation.fuelType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Performance</p>
                    <p className="font-medium">{finalRecommendation.performance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Passengers</p>
                    <p className="font-medium">{finalRecommendation.passengers}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {finalRecommendation.features.map((feature) => (
                    <Badge key={feature} variant="default" className="bg-green-100 text-green-800">{feature}</Badge>
                  ))}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Why This Car is Perfect for You:</h4>
                  <ul className="text-sm space-y-1">
                    <li>✓ Matches your demographic profile and experience level</li>
                    <li>✓ Fits perfectly within your budget and purchase preferences</li>
                    <li>✓ Aligns with your location type and driving environment</li>
                    <li>✓ Suits your primary use case and passenger requirements</li>
                    <li>✓ Meets your performance and feature preferences</li>
                    <li>✓ Resonates with your emotional connection to the vehicle</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button onClick={() => {
                setCurrentStage(0)
                setAnswers({})
                setTopCars([])
                setFinalRecommendation(null)
              }} size="lg">
                Start Over with New Requirements
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
