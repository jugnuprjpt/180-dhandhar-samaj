import type { Database } from './database.types'

type EventRow = Database['public']['Tables']['events']['Row']
type AchievementRow = Database['public']['Tables']['achievements']['Row']
type MemberRow = Database['public']['Tables']['members']['Row']
type DonationRow = Database['public']['Tables']['donations']['Row']
type DonationGoalRow = Database['public']['Tables']['donation_goals']['Row']

const now = new Date().toISOString()

export const mockEvents: EventRow[] = [
  {
    id: 'evt-1',
    title: 'Annual Tech Meetup 2025',
    description: 'A day of talks and workshops on latest tech trends.',
    date: '2025-03-15T10:00:00.000Z',
    location: 'Main Auditorium',
    images: [],
    status: 'upcoming',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'evt-2',
    title: 'Cultural Night',
    description: 'An evening of performances and food.',
    date: '2025-02-28T18:00:00.000Z',
    location: 'Student Center',
    images: [],
    status: 'upcoming',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'evt-3',
    title: 'Career Fair 2024',
    description: 'Connect with recruiters and alumni.',
    date: '2024-11-20T09:00:00.000Z',
    location: 'Convention Hall',
    images: [],
    status: 'past',
    created_at: now,
    updated_at: now,
  },
]

export const mockAchievements: AchievementRow[] = [
  {
    id: 'ach-1',
    member_name: 'Priya Sharma',
    title: 'National Coding Championship',
    rank: '1st Place',
    description: 'Won the national level coding competition.',
    date: '2024-12-01',
    category: 'Academic',
    image: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'ach-2',
    member_name: 'Rahul Verma',
    title: 'Inter-College Cricket',
    rank: 'Best Bowler',
    description: 'Outstanding performance in inter-college cricket.',
    date: '2024-10-15',
    category: 'Sports',
    image: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'ach-3',
    member_name: 'Anita Desai',
    title: 'Drama Festival',
    rank: null,
    description: 'Lead role in the winning drama team.',
    date: '2024-09-20',
    category: 'Cultural',
    image: null,
    created_at: now,
    updated_at: now,
  },
]

export const mockMembers: MemberRow[] = [
  {
    id: 'mem-1',
    name: 'Priya Sharma',
    role: 'President',
    photo: null,
    year: 2022,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mem-2',
    name: 'Rahul Verma',
    role: 'Vice President',
    photo: null,
    year: 2022,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mem-3',
    name: 'Anita Desai',
    role: 'Secretary',
    photo: null,
    year: 2023,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mem-4',
    name: 'Vikram Singh',
    role: 'Treasurer',
    photo: null,
    year: 2023,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mem-5',
    name: 'Sneha Patel',
    role: 'Member',
    photo: null,
    year: 2024,
    created_at: now,
    updated_at: now,
  },
]

export const mockDonations: DonationRow[] = [
  {
    id: 'don-1',
    donor_name: 'Anonymous',
    email: 'anon@example.com',
    amount: 5000,
    date: '2025-01-10T12:00:00.000Z',
    created_at: now,
  },
  {
    id: 'don-2',
    donor_name: 'Alumni Foundation',
    email: 'contact@alumni.edu',
    amount: 25000,
    date: '2025-01-05T09:00:00.000Z',
    created_at: now,
  },
  {
    id: 'don-3',
    donor_name: 'Local Business Co',
    email: 'info@localbiz.com',
    amount: 10000,
    date: '2024-12-20T14:00:00.000Z',
    created_at: now,
  },
]

export const mockDonationGoals: DonationGoalRow[] = [
  {
    id: 'goal-1',
    goal_amount: 100000,
    current_amount: 40000,
    title: 'Community Center Renovation',
    description: 'Funds for upgrading the society community center.',
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'goal-2',
    goal_amount: 50000,
    current_amount: 50000,
    title: 'Scholarship Fund 2024',
    description: 'Annual scholarship for deserving members.',
    is_active: false,
    created_at: now,
    updated_at: now,
  },
]
