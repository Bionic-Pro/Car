import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Car, CheckCircle, ArrowRight, ArrowLeft, Star, User, MapPin, DollarSign, Fuel, ParkingMeter, Clock, CloudSnow, CloudRain, Sun, Thermometer, Home, Briefcase, Heart, Award, Shield, Wifi, Music, Smartphone, Bluetooth, Navigation, Zap, Battery, Leaf, Wind, Gauge, Settings, Calendar, Clock as ClockIcon, AlertTriangle } from 'lucide-react'
import carDatabase from './carDatabase.js'
import './App.css'

function App() {
  const [currentStage, setCurrentStage] = useState(0)
  const [answers, setAnswers] = useState({})
  const [topCars, setTopCars] = useState([])
  const [finalRecommendation, setFinalRecommendation] = useState(null)

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

  const stage1Questions = [
    {
      id: "gender",
      question: "What is your gender? (Optional)",
      type: "radio",
      icon: <User className="h-5 w-5" />,
      optional: true,
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Non-binary", label: "Non-binary" },
        { value: "Other", label: "Other (please specify)", hasInput: true },
        { value: "Prefer not to say", label: "Prefer not to say" }
      ]
    },
    {
      id: "ageGroup",
      question: "What is your age group?",
      type: "radio",
      icon: <User className="h-5 w-5" />,
      options: [
        { value: "Under 21", label: "Under 21" },
        { value: "21-24", label: "21-24" },
        { value: "25-34", label: "25-34" },
        { value: "35-44", label: "35-44" },
        { value: "45-54", label: "45-54" },
        { value: "55-64", label: "55-64" },
        { value: "65-74", label: "65-74" },
        { value: "75+", label: "75+" }
      ]
    },
    {
      id: "drivingExperience",
      question: "How would you describe your driving experience?",
      type: "radio",
      icon: <Car className="h-5 w-5" />,
      options: [
        { value: "First-time driver", label: "First-time driver (0-1 year)" },
        { value: "Novice", label: "Novice (1-3 years)" },
        { value: "Experienced", label: "Experienced (3-10 years)" },
        { value: "Veteran", label: "Veteran (10-20 years)" },
        { value: "Expert", label: "Expert (20+ years)" }
      ]
    },
    {
      id: "locationType",
      question: "What best describes your primary driving location?",
      type: "radio",
      icon: <MapPin className="h-5 w-5" />,
      options: [
        { value: "Dense Urban", label: "Dense Urban (e.g., Manhattan, Tokyo)" },
        { value: "Urban", label: "Urban (city with good infrastructure)" },
        { value: "Suburban", label: "Suburban" },
        { value: "Rural (good roads)", label: "Rural with good roads" },
        { value: "Rural (poor roads)", label: "Rural with poor roads" },
        { value: "Mountainous/Challenging", label: "Mountainous/Challenging terrain" }
      ]
    },
    {
      id: "countryRegion",
      question: "Which country or region do you primarily drive in?",
      type: "text",
      icon: <MapPin className="h-5 w-5" />,
      placeholder: "e.g., United States, Germany, Japan"
    },
    {
      id: "purchaseType",
      question: "Are you looking for a new or used car?",
      type: "radio",
      icon: <DollarSign className="h-5 w-5" />,
      options: [
        { value: "New Car", label: "New Car" },
        { value: "Used Car", label: "Used Car", hasInput: true },
        { value: "Not sure yet", label: "Not sure yet" }
      ]
    },
    {
      id: "usedCarAge",
      question: "If used car, what age range do you prefer?",
      type: "radio",
      icon: <DollarSign className="h-5 w-5" />,
      options: [
        { value: "1 year old or less", label: "1 year old or less" },
        { value: "1-2 years old", label: "1-2 years old" },
        { value: "3-5 years old", label: "3-5 years old" },
        { value: "6-10 years old", label: "6-10 years old" },
        { value: "10+ years old", label: "10+ years old" },
        { value: "Vintage/Classic", label: "Vintage/Classic car" }
      ],
      conditional: { dependsOn: "purchaseType", value: "Used Car" }
    },
    {
      id: "budget",
      question: "What is your budget range (total purchase price)?",
      type: "radio",
      icon: <DollarSign className="h-5 w-5" />,
      options: [
        { value: "Under $10,000", label: "Under $10,000" },
        { value: "$10,000 - $20,000", label: "$10,000 - $20,000" },
        { value: "$20,000 - $30,000", label: "$20,000 - $30,000" },
        { value: "$30,000 - $45,000", label: "$30,000 - $45,000" },
        { value: "$45,000 - $65,000", label: "$45,000 - $65,000" },
        { value: "$65,000 - $90,000", label: "$65,000 - $90,000" },
        { value: "$90,000 - $120,000", label: "$90,000 - $120,000" },
        { value: "Over $120,000", label: "Over $120,000" },
        { value: "Not sure yet", label: "Not sure yet" }
      ]
    },
    {
      id: "primaryUse",
      question: "What will be the primary use of the car? (Select up to 2)",
      type: "checkbox",
      maxSelections: 2,
      icon: <Car className="h-5 w-5" />,
      options: [
        { value: "Daily Commute", label: "🚗 Daily Commute" },
        { value: "Family Transport", label: "👨‍👩‍👧‍👦 Family Transport" },
        { value: "Business/Work", label: "💼 Business/Work" },
        { value: "Ride Sharing", label: "🚖 Ride Sharing (Uber/Lyft)" },
        { value: "Adventure/Off-road", label: "🌲 Adventure/Off-road" },
        { value: "Performance Driving", label: "🏎️ Performance Driving" },
        { value: "Towing/Hauling", label: "🚛 Towing/Hauling" },
        { value: "Weekend Car", label: "🌅 Weekend Car" },
        { value: "Luxury/Status", label: "💎 Luxury/Status" }
      ]
    },
    {
      id: "passengers",
      question: "How many passengers do you typically carry?",
      type: "radio",
      icon: <User className="h-5 w-5" />,
      options: [
        { value: "Just me", label: "Just me" },
        { value: "1-2 passengers", label: "1-2 passengers" },
        { value: "3-4 passengers", label: "3-4 passengers" },
        { value: "5+ passengers", label: "5+ passengers" },
        { value: "Pets only", label: "Mostly pets" },
        { value: "Varies a lot", label: "Varies a lot" }
      ]
    },
    {
      id: "bodyStyle",
      question: "What type of vehicle are you interested in? (Select up to 3)",
      type: "checkbox",
      maxSelections: 3,
      icon: <Car className="h-5 w-5" />,
      options: [
        { value: "Sedan", label: "🚗 Sedan" },
        { value: "SUV", label: "🚙 SUV" },
        { value: "Crossover", label: "🏢 Crossover" },
        { value: "Truck", label: "🛻 Truck" },
        { value: "Hatchback", label: "🚙 Hatchback" },
        { value: "Minivan", label: "🚐 Minivan" },
        { value: "Sports Car", label: "🏎️ Sports Car" },
        { value: "Convertible", label: "🚗💨 Convertible" },
        { value: "Wagon", label: "🚙 Wagon" },
        { value: "Electric Vehicle", label: "🔌 Electric Vehicle" },
        { value: "Hybrid", label: "🔋 Hybrid" },
        { value: "Luxury", label: "💎 Luxury Vehicle" }
      ]
    },
    {
      id: "fuelType",
      question: "What type of fuel do you prefer? (Select up to 2)",
      type: "checkbox",
      maxSelections: 2,
      icon: <Fuel className="h-5 w-5" />,
      options: [
        { value: "Gasoline", label: "⛽ Gasoline" },
        { value: "Diesel", label: "⛽ Diesel" },
        { value: "Hybrid (HEV)", label: "🔋 Hybrid (HEV)" },
        { value: "Plug-in Hybrid (PHEV)", label: "🔌 Plug-in Hybrid" },
        { value: "Electric (BEV)", label: "⚡ Electric (BEV)" },
        { value: "Hydrogen (FCEV)", label: "💧 Hydrogen (FCEV)" },
        { value: "Flex Fuel", label: "🔄 Flex Fuel" },
        { value: "No Preference", label: "🤷 No Preference" }
      ]
    },
    {
      id: "currentCar",
      question: "What is your current or most recent car? (Make, Model, Year)",
      type: "text",
      icon: <Car className="h-5 w-5" />,
      optional: true,
      placeholder: "e.g., Toyota Camry 2020"
    }
  ]

  const stage2Questions = [
    {
      id: "mustHaveFeatures",
      question: "Select your must-have features (choose 3-5)",
      type: "checkbox",
      maxSelections: 5,
      icon: <Star className="h-5 w-5" />,
      categories: [
        {
          name: "Safety",
          icon: <Shield className="h-4 w-4" />,
          options: [
            { value: "adaptive_cruise", label: "Adaptive Cruise Control" },
            { value: "blind_spot", label: "Blind Spot Monitoring" },
            { value: "emergency_braking", label: "Automatic Emergency Braking" },
            { value: "lane_keep", label: "Lane Keeping Assist" },
            { value: "rear_cross_traffic", label: "Rear Cross-Traffic Alert" },
            { value: "surround_cam", label: "360° Camera System" },
            { value: "night_vision", label: "Night Vision" },
            { value: "head_up_display", label: "Head-Up Display" }
          ]
        },
        {
          name: "Comfort & Convenience",
          icon: <Home className="h-4 w-4" />,
          options: [
            { value: "heated_seats", label: "Heated Seats" },
            { value: "ventilated_seats", label: "Ventilated/Cooled Seats" },
            { value: "massage_seats", label: "Massage Seats" },
            { value: "panoramic_roof", label: "Panoramic Sunroof" },
            { value: "power_liftgate", label: "Power Liftgate" },
            { value: "remote_start", label: "Remote Start" },
            { value: "hands_free_liftgate", label: "Hands-Free Liftgate" },
            { value: "air_suspension", label: "Air Suspension" }
          ]
        },
        {
          name: "Technology",
          icon: <Wifi className="h-4 w-4" />,
          options: [
            { value: "apple_carplay", label: "Apple CarPlay" },
            { value: "android_auto", label: "Android Auto" },
            { value: "wireless_charging", label: "Wireless Charging" },
            { value: "premium_audio", label: "Premium Audio System" },
            { value: "wireless_apple_carplay", label: "Wireless Apple CarPlay" },
            { value: "digital_key", label: "Digital Key (Phone as Key)" },
            { value: "wifi_hotspot", label: "WiFi Hotspot" },
            { value: "rear_seat_entertainment", label: "Rear Seat Entertainment" }
          ]
        },
        {
          name: "Performance",
          icon: <Gauge className="h-4 w-4" />,
          options: [
            { value: "awd", label: "All-Wheel Drive (AWD/4WD)" },
            { value: "sport_mode", label: "Sport Mode" },
            { value: "launch_control", label: "Launch Control" },
            { value: "adjustable_suspension", label: "Adjustable Suspension" },
            { value: "towing_package", label: "Towing Package" },
            { value: "off_road_package", label: "Off-Road Package" },
            { value: "performance_brakes", label: "Performance Brakes" },
            { value: "limited_slip_diff", label: "Limited-Slip Differential" }
          ]
        },
        {
          name: "Climate",
          icon: <Thermometer className="h-4 w-4" />,
          options: [
            { value: "dual_zone_climate", label: "Dual-Zone Climate Control" },
            { value: "rear_ac_vents", label: "Rear AC Vents" },
            { value: "heated_steering_wheel", label: "Heated Steering Wheel" },
            { value: "heated_rear_seats", label: "Heated Rear Seats" },
            { value: "cooled_seats", label: "Cooled/Ventilated Seats" },
            { value: "remote_climate", label: "Remote Climate Control" },
            { value: "windshield_deicer", label: "Windshield De-Icer" },
            { value: "heated_washer_nozzles", label: "Heated Washer Nozzles" }
          ]
        }
      ]
    },
    {
      id: "parkingSituation",
      question: "What is your typical parking situation?",
      type: "radio",
      icon: <ParkingMeter className="h-5 w-5" />,
      options: [
        { value: "street", label: "Street Parking" },
        { value: "driveway", label: "Private Driveway" },
        { value: "garage", label: "Private Garage" },
        { value: "underground", label: "Underground Parking" },
        { value: "carport", label: "Carport" },
        { value: "tight_space", label: "Limited/Small Parking Space" },
        { value: "assigned_parking", label: "Assigned Parking Spot" },
        { value: "no_dedicated", label: "No Dedicated Parking" }
      ]
    },
    {
      id: "annualMileage",
      question: "How many miles/kilometers do you drive annually?",
      type: "radio",
      icon: <Gauge className="h-5 w-5" />,
      options: [
        { value: "under_5k", label: "Under 5,000 mi (8,000 km)" },
        { value: "5k_10k", label: "5,000 - 10,000 mi (8,000 - 16,000 km)" },
        { value: "10k_15k", label: "10,000 - 15,000 mi (16,000 - 24,000 km)" },
        { value: "15k_20k", label: "15,000 - 20,000 mi (24,000 - 32,000 km)" },
        { value: "over_20k", label: "Over 20,000 mi (32,000 km)" }
      ]
    },
    {
      id: "climateConditions",
      question: "What climate conditions do you typically drive in? (Select all that apply)",
      type: "checkbox",
      icon: <CloudSnow className="h-5 w-5" />,
      options: [
        { value: "hot", label: "☀️ Hot (consistently above 30°C/86°F)" },
        { value: "cold", label: "❄️ Cold (frequently below freezing)" },
        { value: "snow", label: "🌨️ Heavy snow" },
        { value: "rain", label: "🌧️ Heavy rain" },
        { value: "mild", label: "🌤️ Mild/temperate" },
        { value: "humid", label: "💦 Humid" },
        { value: "dry", label: "🏜️ Dry/desert" },
        { value: "mountainous", label: "⛰️ Mountainous terrain" }
      ]
    },
    {
      id: "ownershipDuration",
      question: "How long do you plan to keep this vehicle?",
      type: "radio",
      icon: <ClockIcon className="h-5 w-5" />,
      options: [
        { value: "1-2_years", label: "1-2 years" },
        { value: "3-5_years", label: "3-5 years" },
        { value: "5-7_years", label: "5-7 years" },
        { value: "7-10_years", label: "7-10 years" },
        { value: "10+_years", label: "10+ years" },
        { value: "indefinitely", label: "As long as it runs" }
      ]
    },
    {
      id: "priorityFactors",
      question: "Rank these factors by importance (drag to reorder)",
      type: "sortable",
      icon: <Settings className="h-5 w-5" />,
      options: [
        { value: "reliability", label: "🔧 Reliability" },
        { value: "safety", label: "🛡️ Safety" },
        { value: "fuel_efficiency", label: "⛽ Fuel Efficiency" },
        { value: "performance", label: "🚀 Performance" },
        { value: "comfort", label: "🛋️ Comfort" },
        { value: "tech_features", label: "📱 Technology" },
        { value: "cargo_space", label: "🧳 Cargo Space" },
        { value: "resale_value", label: "💰 Resale Value" },
        { value: "environmental_impact", label: "🌱 Environmental Impact" },
        { value: "brand_prestige", label: "🏆 Brand Prestige" }
      ]
    },
    {
      id: "dealBreakers",
      question: "Are there any absolute deal-breakers for you? (Select all that apply)",
      type: "checkbox",
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      options: [
        { value: "no_apple_carplay", label: "No Apple CarPlay" },
        { value: "no_android_auto", label: "No Apple CarPlay/Android Auto" },
        { value: "no_awd", label: "No AWD/4WD option" },
        { value: "poor_safety_ratings", label: "Poor safety ratings" },
        { value: "low_mpg", label: "Low fuel efficiency" },
        { value: "small_trunk", label: "Insufficient cargo space" },
        { value: "expensive_maintenance", label: "Expensive maintenance" },
        { value: "limited_availability", label: "Limited availability in my area" },
        { value: "no_ev_option", label: "No electric/hybrid option" },
        { value: "none", label: "No deal-breakers" }
      ]
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
      options: []
    },
    {
      id: "specificScenario",
      question: "Consider your most frequent or challenging driving scenario. Which of these cars best addresses that scenario?",
      type: "radio",
      icon: <MapPin className="h-5 w-5" />,
      options: []
    },
    {
      id: "longTermOwnership",
      question: "Looking 3-5 years down the road, which car do you envision yourself being most satisfied with?",
      type: "radio",
      icon: <Star className="h-5 w-5" />,
      options: []
    },
    {
      id: "emotionalConnection",
      question: "Beyond the practicalities, which car truly excites you or feels like 'the one'? What is it about that car that creates this emotional connection?",
      type: "textarea",
      icon: <Star className="h-5 w-5" />,
      placeholder: "Describe what appeals to you most about your preferred choice and why it resonates with you emotionally..."
    }
  ]

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

  const nextStage = () => {
    if (currentStage === 1) {
      const rankedCars = filterAndRankCars();
      setTopCars(rankedCars.slice(0, 7));
    } else if (currentStage === 2) {
      const rankedCars = filterAndRankCars();
      const top5 = rankedCars.slice(0, 5);
      setTopCars(top5);

      const top3 = top5.slice(0, 3);
      stage3Questions[0].options = top3.map((car, index) => ({ value: index.toString(), label: `${car.make} ${car.model}` }));
      stage3Questions[1].options = top3.map((car, index) => ({ value: index.toString(), label: `${car.make} ${car.model}` }));
      stage3Questions[2].options = top3.map((car, index) => ({ value: index.toString(), label: `${car.make} ${car.model}` }));
    } else if (currentStage === 3) {
      const rankedCars = filterAndRankCars();
      const top3 = rankedCars.slice(0, 3);
      let finalCar = top3[0]; // Default to the highest scored car

      if (answers.testDriveImpression && top3[parseInt(answers.testDriveImpression)]) {
        finalCar = top3[parseInt(answers.testDriveImpression)];
      } else if (answers.longTermOwnership && top3[parseInt(answers.longTermOwnership)]) {
        finalCar = top3[parseInt(answers.longTermOwnership)];
      }
      setFinalRecommendation(finalCar);
    }
    
    setCurrentStage(prev => prev + 1);
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

            {stage3Questions.map((question) => renderQuestion(question))}

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
  )
}

export default App

