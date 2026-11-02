import type { LoungeEvent } from '../types/models';
import { daysFromToday } from '../utils/format';
import { images } from './images';

export const demoEvents: LoungeEvent[] = [
{ id: 'e-01', name: 'Jazz & Wine Evening', description: 'An intimate evening with the Nairobi Jazz Quartet, paired with a curated selection of South African and French wines.', date: daysFromToday(3), startTime: '19:00', endTime: '23:00', category: 'Live Music', image: images.jazz, ticketPrice: 2500, expectedAttendance: 120, status: 'Upcoming', isDemo: true },
{ id: 'e-02', name: 'Afro-House Saturdays', description: 'Resident and guest DJs spin deep Afro-house until late. VIP booths available with bottle service.', date: daysFromToday(5), startTime: '21:00', endTime: '03:00', category: 'DJ Night', image: images.dj, ticketPrice: 1000, expectedAttendance: 250, status: 'Upcoming', isDemo: true },
{ id: 'e-03', name: 'Premier League Super Sunday', description: 'Catch the big match on our cinema-size screens with game-day platters and bucket offers.', date: daysFromToday(6), startTime: '16:00', endTime: '22:00', category: 'Sports Screening', image: images.bar, ticketPrice: 0, expectedAttendance: 180, status: 'Upcoming', isDemo: true },
{ id: 'e-04', name: 'Chef’s Table: Swahili Coast', description: 'A seven-course tasting journey through Lamu and Mombasa flavours, hosted by our head chef. Limited seats.', date: daysFromToday(10), startTime: '19:30', endTime: '22:30', category: 'Dining Experience', image: images.chef, ticketPrice: 6500, expectedAttendance: 40, status: 'Sold Out', isDemo: true },
{ id: 'e-05', name: 'Laugh Lounge Comedy Night', description: 'Kenya’s rising stand-up comedians take the stage for a night of non-stop laughs.', date: daysFromToday(12), startTime: '20:00', endTime: '23:00', category: 'Comedy', image: images.terrace, ticketPrice: 1500, expectedAttendance: 150, status: 'Upcoming', isDemo: true },
{ id: 'e-06', name: 'The Gold & Black Gala', description: 'Our signature themed night. Dress in gold and black for champagne, live saxophone and a midnight DJ set.', date: daysFromToday(19), startTime: '20:00', endTime: '02:00', category: 'Themed Night', image: images.hero, ticketPrice: 5000, expectedAttendance: 300, status: 'Upcoming', isDemo: true },
{ id: 'e-07', name: 'Amapiano Fridays', description: 'Log drums and good vibes with DJ Sheks and friends.', date: daysFromToday(-3), startTime: '21:00', endTime: '03:00', category: 'DJ Night', image: images.dj, ticketPrice: 1000, expectedAttendance: 220, status: 'Completed', isDemo: true }];


export const eventCategories = ['Live Music', 'DJ Night', 'Dining Experience', 'Comedy', 'Sports Screening', 'Themed Night'] as const;
export const eventStatuses = ['Draft', 'Upcoming', 'Sold Out', 'Completed', 'Cancelled'] as const;