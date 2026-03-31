 export type SentimentBreakdown = {
  positive: number
  neutral: number
  negative: number
}

export type Issue = {
  name: string
  value: number
}

export type Restaurant = {
  id: string
  name: string
  location: string
  rating: number
  sentiment: number
  image: string
  description: string
  sentimentBreakdown: SentimentBreakdown
  issues: Issue[]
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "The Modern Table",
    location: "Downtown, New York",
    rating: 4.5,
    sentiment: 85,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    description: "Contemporary dining with seasonal ingredients.",

    sentimentBreakdown: {
      positive: 65,
      neutral: 20,
      negative: 15,
    },

    issues: [
      { name: "Food Quality", value: 8 },
      { name: "Service Delay", value: 15 },
      { name: "Hygiene", value: 5 },
      { name: "Noise Level", value: 12 },
      { name: "Price Value", value: 10 },
    ],
  },

  {
    id: "2",
    name: "Cozy Corner Cafe",
    location: "Brooklyn, New York",
    rating: 4.8,
    sentiment: 92,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    description: "Warm cozy cafe with great coffee.",

    sentimentBreakdown: {
      positive: 75,
      neutral: 15,
      negative: 10,
    },

    issues: [
      { name: "Food Quality", value: 6 },
      { name: "Service Delay", value: 10 },
      { name: "Hygiene", value: 4 },
      { name: "Noise Level", value: 8 },
      { name: "Price Value", value: 7 },
    ],
  },
]