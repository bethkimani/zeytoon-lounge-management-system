export const lounge = {
  name: 'Zeytoon Lounge',
  tagline: 'Fine dining, live entertainment & nightlife',
  address: 'USIU Road, behind Safari Park Mall, Nairobi, Kenya',
  phone: '0745 104 247',
  whatsapp: '254745104247',
  email: 'zeytoonlounge254@gmail.com',
  mapEmbed: 'https://www.google.com/maps?q=Safari+Park+Mall,+USIU+Road,+Nairobi&output=embed',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=Safari+Park+Mall+USIU+Road+Nairobi',
  hours: [
  { days: 'Monday – Thursday', time: '12:00 PM – 12:00 AM' },
  { days: 'Friday – Saturday', time: '12:00 PM – 3:00 AM' },
  { days: 'Sunday', time: '12:00 PM – 11:00 PM' }]

};

export function whatsappLink(message = 'Hello Zeytoon Lounge, I would like to make a reservation.'): string {
  return `https://wa.me/${lounge.whatsapp}?text=${encodeURIComponent(message)}`;
}