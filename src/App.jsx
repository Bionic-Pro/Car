import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Car, CheckCircle, ArrowRight, ArrowLeft, Star, User, MapPin, DollarSign, Fuel, ParkingMeter, Clock, CloudSnow, CloudRain, Sun, Thermometer, Home, Briefcase, Heart, Award, Shield, Wifi, Music, Smartphone, Bluetooth, Navigation, Zap, Battery, Leaf, Wind, Gauge, Settings, Calendar, Clock as ClockIcon, AlertTriangle, MessageSquare } from 'lucide-react'
import carDatabase from './carDatabase.js'
import './App.css'

// Stage 1 Questions
const stage1Questions = [
  {
    id: 'purchaseType',
    question: 'What type of vehicle are you looking for?',
    type: 'radio',
    icon: <Car className="h-5 w-5" />,
    options: [
      { value: 'New Car', label: 'New Car' },
      { value: 'Used Car', label: 'Used Car' },
      { value: 'Not Sure', label: 'Not Sure' }
    ]
  },
  {
    id: 'budget',
    question: 'What is your budget?',
    type: 'radio',
    icon: <DollarSign className="h-5 w-5" />,
    options: [
      { value: 'under_20k', label: 'Under $20,000' },
      { value: '20k_30k', label: '$20,000 - $30,000' },
      { value: '30k_40k', label: '$30,000 - $40,000' },
      { value: '40k_50k', label: '$40,000 - $50,000' },
      { value: 'over_50k', label: 'Over $50,000' }
    ]
  },
  {
    id: 'bodyType',
    question: 'What type of vehicle body style are you interested in?',
    type: 'checkbox',
    icon: <Car className="h-5 w-5" />,
    options: [
      { value: 'sedan', label: 'Sedan' },
      { value: 'suv', label: 'SUV' },
      { value: 'truck', label: 'Truck' },
      { value: 'van', label: 'Van/Minivan' },
      { value: 'hatchback', label: 'Hatchback' },
      { value: 'coupe', label: 'Coupe' },
      { value: 'convertible', label: 'Convertible' },
      { value: 'wagon', label: 'Wagon' }
    ]
  }
];

// Stage 2 Questions
const stage2Questions = [
  {
    id: 'mustHaveFeatures',
    question: 'Select your must-have features:',
    type: 'checkbox',
    icon: <CheckCircle className="h-5 w-5" />,
    options: [
      { value: 'leather_seats', label: 'Leather Seats' },
      { value: 'sunroof', label: 'Sunroof/Moonroof' },
      { value: 'navigation', label: 'Navigation System' },
      { value: 'backup_camera', label: 'Backup Camera' },
      { value: 'apple_carplay', label: 'Apple CarPlay/Android Auto' },
      { value: 'heated_seats', label: 'Heated Seats' },
      { value: 'cooled_seats', label: 'Cooled/Ventilated Seats' },
      { value: 'premium_audio', label: 'Premium Audio System' },
      { value: 'blind_spot', label: 'Blind Spot Monitoring' },
      { value: 'adaptive_cruise', label: 'Adaptive Cruise Control' }
    ]
  },
  {
    id: 'parkingSituation',
    question: 'What is your typical parking situation?',
    type: 'radio',
    icon: <ParkingMeter className="h-5 w-5" />,
    options: [
      { value: 'street', label: 'Street parking' },
      { value: 'driveway', label: 'Driveway' },
      { value: 'garage', label: 'Garage' },
      { value: 'carport', label: 'Carport' }
    ]
  },
  {
    id: 'annualMileage',
    question: 'What is your estimated annual mileage?',
    type: 'radio',
    icon: <Gauge className="h-5 w-5" />,
    options: [
      { value: 'under_5k', label: 'Under 5,000 miles' },
      { value: '5k_10k', label: '5,000 - 10,000 miles' },
      { value: '10k_15k', label: '10,001 - 15,000 miles' },
      { value: 'over_15k', label: 'Over 15,000 miles' }
    ]
  },
  {
    id: 'climate',
    question: 'What type of climate do you typically drive in?',
    type: 'checkbox',
    icon: <Thermometer className="h-5 w-5" />,
    options: [
      { value: 'hot', label: 'Hot (frequent temperatures above 90°F/32°C)' },
      { value: 'cold', label: 'Cold (frequent temperatures below freezing)' },
      { value: 'snow', label: 'Heavy snow/winter conditions' },
      { value: 'rain', label: 'Frequent rain' },
      { value: 'mild', label: 'Mild/temperate' }
    ]
  },
  {
    id: 'dealBreakerFeatures',
    question: 'Select any deal-breaker features:',
    type: 'checkbox',
    icon: <AlertTriangle className="h-5 w-5" />,
    options: [
      { value: 'manual_transmission', label: 'Manual transmission' },
      { value: 'no_android_auto', label: 'No Apple CarPlay/Android Auto' },
      { value: 'no_awd', label: 'No AWD/4WD option' },
      { value: 'poor_safety_ratings', label: 'Poor safety ratings' },
      { value: 'low_mpg', label: 'Low fuel efficiency' },
      { value: 'small_trunk', label: 'Insufficient cargo space' },
      { value: 'expensive_maintenance', label: 'Expensive maintenance' },
      { value: 'limited_availability', label: 'Limited availability in my area' },
      { value: 'no_ev_option', label: 'No electric/hybrid option' },
      { value: 'none', label: 'No deal-breakers' }
    ]
  }
];

// Stage 3 Questions (will be populated dynamically based on previous answers)
const stage3Questions = [
  {
    id: 'testDriveImpression',
    question: 'Which car would you like to test drive first?',
    type: 'radio',
    icon: <Car className="h-5 w-5" />,
    options: [] // Will be populated dynamically
  },
  {
    id: 'longTermOwnership',
    question: 'Which car do you see yourself owning long-term?',
    type: 'radio',
    icon: <Calendar className="h-5 w-5" />,
    options: [] // Will be populated dynamically
  },
  {
    id: 'finalThoughts',
    question: 'Any final thoughts or specific features you\'re looking for?',
    type: 'textarea',
    icon: <MessageSquare className="h-5 w-5" />,
    optional: true,
    placeholder: 'Type your thoughts here...'
  }
];

function App() {
  const [currentStage, setCurrentStage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [topCars, setTopCars] = useState([]);
  const [finalRecommendation, setFinalRecommendation] = useState(null);
  const [stage3DynamicQuestions, setStage3DynamicQuestions] = useState(stage3Questions);
  
  // Helper function to get questions for the current stage
  const getQuestionsForStage = (stage) => {
    switch(stage) {
      case 1: return stage1Questions;
      case 2: return stage2Questions;
      case 3: return stage3DynamicQuestions;
      default: return [];
    }
  };
  
  // Get current stage questions
  const currentQuestions = getQuestionsForStage(currentStage);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleMultiSelectChange = (questionId, value, isChecked) => {
    setAnswers(prev => {
      const currentValues = prev[questionId] || []
      if (isChecked) {
        return { ...prev, [questionId]: [...currentValues, value] }
      } else {
        return { ...prev, [questionId]: currentValues.filter(item => item !== value) }
      }
    })
  }
  

  const calculateScore = (car, currentAnswers) => {
    let score = 0;

    // Demographics
    if (currentAnswers.gender && car.demographics.gender.includes(currentAnswers.gender)) score += 2;
    if (currentAnswers.ageGroup && car.demographics.ageGroup.includes(currentAnswers.ageGroup)) score += 2;
    if (currentAnswers.drivingExperience && car.demographics.drivingExperience.includes(currentAnswers.drivingExperience)) score += 2;

    // Location
    if (currentAnswers.locationType && car.locationType.includes(currentAnswers.locationType)) score += 3;

    // Budget
    let minPrice = 0, maxPrice = Infinity;
    switch (currentAnswers.budget) {
      case "Under $15,000": maxPrice = 14999; break;
      case "$15,000 - $25,000": minPrice = 15000; maxPrice = 25000; break;
      case "$25,000 - $40,000": minPrice = 25000; maxPrice = 40000; break;
      case "$40,000 - $60,000": minPrice = 40000; maxPrice = 60000; break;
      case "$60,000 - $80,000": minPrice = 60000; maxPrice = 80000; break;
      case "Over $80,000": minPrice = 80001; break;
    }
    let carPrice = 0;
    if (currentAnswers.purchaseType === "New Car" && car.price.new) {
      carPrice = car.price.new;
    } else if (currentAnswers.purchaseType === "Used Car") {
      switch (currentAnswers.usedCarAge) {
        case "1-2 years old": carPrice = car.price.used_1_year || car.price.new; break;
        case "3-5 years old": carPrice = car.price.used_3_year || car.price.used_1_year || car.price.new; break;
        case "6-10 years old": carPrice = car.price.used_5_year || car.price.used_3_year || car.price.used_1_year || car.price.new; break;
        case "10+ years old": carPrice = car.price.used_10_year || car.price.used_5_year || car.price.used_3_year || car.price.used_1_year || car.price.new; break;
        default: carPrice = car.price.new;
      }
    } else {
      carPrice = car.price.new;
    }
    if (carPrice >= minPrice && carPrice <= maxPrice) score += 5; // High importance for budget

    // Body Style
    if (currentAnswers.bodyStyle && currentAnswers.bodyStyle.length > 0) {
      if (currentAnswers.bodyStyle.some(style => car.bodyStyle.includes(style))) score += 4;
    }

    // Fuel Type
    if (currentAnswers.fuelType && currentAnswers.fuelType.length > 0 && !currentAnswers.fuelType.includes("No Strong Preference")) {
      if (currentAnswers.fuelType.some(type => car.fuelType.includes(type))) score += 4;
    }

    // Passengers
    if (currentAnswers.passengers && car.passengers === currentAnswers.passengers) score += 3;

    // Stage 2 refinements
    if (currentAnswers.drivingPreference && car.performance === currentAnswers.drivingPreference) score += 3;

    // Must-have and deal-breaker features
    if (currentAnswers.mustHaveFeatures) {
      const mustHaves = currentAnswers.mustHaveFeatures.toLowerCase().split(',').map(s => s.trim());
      for (const feature of mustHaves) {
        if (car.features.some(f => f.toLowerCase().includes(feature))) {
          score += 2; // Add score for each matching must-have feature
        }
      }
    }
    if (currentAnswers.dealBreakerFeatures) {
      const dealBreakers = currentAnswers.dealBreakerFeatures.toLowerCase().split(',').map(s => s.trim());
      for (const feature of dealBreakers) {
        if (car.features.some(f => f.toLowerCase().includes(feature))) {
          return 0; // Disqualify car if it has a deal-breaker
        }
      }
    }

    return score;
  }

  const filterAndRankCars = () => {
    const scoredCars = carDatabase.map(car => ({
      ...car,
      score: calculateScore(car, answers)
    }));

    scoredCars.sort((a, b) => b.score - a.score);

    return scoredCars.filter(car => car.score > 0); // Only return cars with a positive score
  }

  const nextStage = async () => {
    console.log('Current stage:', currentStage);
    
    try {
      // Handle stage transitions
      if (currentStage === 0) {
        // Moving from welcome screen to stage 1
        console.log('Moving to stage 1');
        setCurrentStage(1);
        return;
      }
      
      if (currentStage === 1) {
        // Moving from stage 1 to stage 2
        console.log('Processing stage 1 to stage 2 transition');
        
        // Validate required answers
        const currentQuestions = stage1Questions;
        const requiredQuestions = currentQuestions.filter(q => !q.optional);
        const missingRequired = requiredQuestions.some(q => !answers[q.id]);
        
        if (missingRequired) {
          console.error('Missing required answers');
          // Show error to user
          return; // Don't proceed to next stage
        }
        
        console.log('Filtering and ranking cars...');
        const rankedCars = filterAndRankCars();
        console.log(`Found ${rankedCars.length} ranked cars`);
        
        if (rankedCars.length === 0) {
          console.error('No cars matched your criteria');
          // Show error to user
          return; // Don't proceed if no cars match
        }
        
        setTopCars(rankedCars.slice(0, 7));
        console.log('Moving to stage 2');
        setCurrentStage(2);
        return;
      }
      
      if (currentStage === 2) {
        // Moving from stage 2 to stage 3
        console.log('Processing stage 2 to stage 3 transition');
        
        const rankedCars = filterAndRankCars();
        const top5 = rankedCars.slice(0, 5);
        setTopCars(top5);
        
        if (top5.length > 0) {
          const top3 = top5.slice(0, 3);
          // Update stage 3 questions with top 3 cars
          const updatedStage3Questions = stage3Questions.map((question, index) => ({
            ...question,
            options: top3.map((car, i) => ({
              value: i.toString(),
              label: `${car.make} ${car.model}`
            }))
          }));
          
          setStage3DynamicQuestions(updatedStage3Questions);
          console.log('Moving to stage 3');
          setCurrentStage(3);
        }
        return;
      }
      
      if (currentStage === 3) {
        // Final stage - show results
        console.log('Processing final stage');
        const rankedCars = filterAndRankCars();
        const top3 = rankedCars.slice(0, 3);
        const finalCar = top3[0]; // Default to the highest scored car

      if (answers.testDriveImpression && top3[parseInt(answers.testDriveImpression)]) {
        finalCar = top3[parseInt(answers.testDriveImpression)];
      } else if (answers.longTermOwnership && top3[parseInt(answers.longTermOwnership)]) {
        finalCar = top3[parseInt(answers.longTermOwnership)];
      }
      setFinalRecommendation(finalCar);
    }
    
    setCurrentStage(prev => prev + 1);
  } catch (error) {
    console.error('Error in nextStage:', error);
    // Optionally show an error message to the user
    alert('An error occurred while processing your request. Please try again.');
  }

  const prevStage = () => {
    setCurrentStage(prev => prev - 1);
  }

  const shouldShowQuestion = (question) => {
    if (!question.conditional) return true;
    return answers[question.conditional.dependsOn] === question.conditional.value;
  }

  const renderQuestion = (question) => {
    if (!shouldShowQuestion(question)) return null;
    
    const currentAnswer = answers[question.id];

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
              value={currentAnswer || ""}
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
          {question.type === "checkbox" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={currentAnswer && currentAnswer.includes(option.value)}
                    onCheckedChange={(isChecked) => handleMultiSelectChange(question.id, option.value, isChecked)}
                  />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </div>
          )}
          {question.type === "text" && (
            <Input
              value={currentAnswer || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder={question.placeholder || "Enter your answer..."}
            />
          )}
          {question.type === "textarea" && (
            <Textarea
              value={currentAnswer || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder={question.placeholder || "Enter your answer..."}
              rows={3}
            />
          )}
        </CardContent>
      </Card>
    )
  }

  const renderCarCard = (car) => {
    let price = 0;
    if (answers.purchaseType === "New Car" && car.price.new) {
      price = car.price.new;
    } else if (answers.purchaseType === "Used Car") {
      switch (answers.usedCarAge) {
        case "1-2 years old": price = car.price.used_1_year || car.price.new; break;
        case "3-5 years old": price = car.price.used_3_year || car.price.used_1_year || car.price.new; break;
        case "6-10 years old": price = car.price.used_5_year || car.price.used_3_year || car.price.used_1_year || car.price.new; break;
        case "10+ years old": price = car.price.used_10_year || car.price.used_5_year || car.price.used_3_year || car.price.used_1_year || car.price.new; break;
        default: price = car.price.new;
      }
    } else {
      price = car.price.new;
    }

    return (
      <Card key={car.id} className="mb-4 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              {car.make} {car.model} ({car.year})
            </div>
            <Badge variant="secondary">Score: {car.score}</Badge>
          </CardTitle>
          <CardDescription className="text-lg font-semibold text-green-600">
            {price ? `$${price.toLocaleString()}` : 'Price N/A'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Body Style</p>
              <p className="font-medium">{car.bodyStyle.join(', ')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fuel Type</p>
              <p className="font-medium">{car.fuelType.join(', ')}</p>
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
      const requiredFields = ["gender", "ageGroup", "drivingExperience", "locationType", "countryRegion", "purchaseType", "budget", "primaryUse", "passengers"]
      const allRequiredAnswered = requiredFields.every(field => answers[field])
      const fuelTypeAnswered = answers.fuelType && answers.fuelType.length > 0
      const bodyStyleAnswered = answers.bodyStyle && answers.bodyStyle.length > 0

      const usedCarAgeAnswered = answers.purchaseType === "Used Car" ? (answers.usedCarAge !== undefined) : true

      return allRequiredAnswered && fuelTypeAnswered && bodyStyleAnswered && usedCarAgeAnswered
    }
    if (currentStage === 2) {
      const requiredFields = ["drivingPreference", "enginePowerImportance", "brandImportance", "reliabilityVsInnovation"]
      return requiredFields.every(field => answers[field])
    }
    if (currentStage === 3) {
      return (answers.testDriveImpression !== undefined && answers.testDriveImpression !== '') || 
             (answers.specificScenario !== undefined && answers.specificScenario !== '') || 
             (answers.longTermOwnership !== undefined && answers.longTermOwnership !== '') || 
             (answers.emotionalConnection !== undefined && answers.emotionalConnection !== '')
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

            {stage1Questions.map((question) => renderQuestion(question))}

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
                  Based on your profile, here are your top {topCars.length} car recommendations. Now let's refine to your top 3-5 finalists.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Your Top {topCars.length} Car Recommendations:</h3>
              {topCars.length > 0 ? (
                topCars.map((car) => renderCarCard(car))
              ) : (
                <p className="text-gray-600">No cars matched your criteria from Stage 1. Please go back and adjust your answers.</p>
              )}
            </div>

            {stage2Questions.map((question) => renderQuestion(question))}

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStage}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={nextStage} disabled={!isStageComplete() || topCars.length === 0}>
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
                  These are your final {topCars.slice(0,3).length} car options. Let's find the one that truly resonates with you.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Your Top {topCars.slice(0,3).length} Finalists:</h3>
              {topCars.slice(0,3).length > 0 ? (
                topCars.slice(0,3).map((car) => renderCarCard(car))
              ) : (
                <p className="text-gray-600">No cars matched your criteria from Stage 2. Please go back and adjust your answers.</p>
              )}
            </div>

            {stage3DynamicQuestions.map((question) => renderQuestion(question))}

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStage}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={nextStage} disabled={!isStageComplete() || topCars.slice(0,3).length === 0}>
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
                    <p className="font-medium">{finalRecommendation.bodyStyle.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fuel Type</p>
                    <p className="font-medium">{finalRecommendation.fuelType.join(', ')}</p>
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
  );
}

export default App;

