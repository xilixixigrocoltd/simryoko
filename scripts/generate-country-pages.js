#!/usr/bin/env node
/**
 * SimRyoko Country Landing Page Generator
 * Generates SEO-optimized landing pages for 214 countries/regions
 * Created: 2026-03-14
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'countries');

// 214 countries with metadata
const countries = [
  // Asia
  { name: 'Japan', slug: 'japan', code: 'JP', region: 'Asia', emoji: '🇯🇵', cities: ['Tokyo', 'Osaka', 'Kyoto'], carrier: 'NTT Docomo', gradient: '#667eea, #764ba2', price: 4 },
  { name: 'South Korea', slug: 'south-korea', code: 'KR', region: 'Asia', emoji: '🇰🇷', cities: ['Seoul', 'Busan', 'Jeju'], carrier: 'SK Telecom', gradient: '#667eea, #764ba2', price: 4 },
  { name: 'China', slug: 'china', code: 'CN', region: 'Asia', emoji: '🇨🇳', cities: ['Beijing', 'Shanghai', 'Shenzhen'], carrier: 'China Mobile', gradient: '#e53e3e, #dd6b20', price: 5 },
  { name: 'Thailand', slug: 'thailand', code: 'TH', region: 'Asia', emoji: '🇹🇭', cities: ['Bangkok', 'Chiang Mai', 'Phuket'], carrier: 'AIS', gradient: '#667eea, #764ba2', price: 3 },
  { name: 'Vietnam', slug: 'vietnam', code: 'VN', region: 'Asia', emoji: '🇻🇳', cities: ['Ho Chi Minh', 'Hanoi', 'Da Nang'], carrier: 'Viettel', gradient: '#e53e3e, #dd6b20', price: 3 },
  { name: 'Singapore', slug: 'singapore', code: 'SG', region: 'Asia', emoji: '🇸🇬', cities: ['Singapore'], carrier: 'Singtel', gradient: '#e53e3e, #764ba2', price: 4 },
  { name: 'Malaysia', slug: 'malaysia', code: 'MY', region: 'Asia', emoji: '🇲🇾', cities: ['Kuala Lumpur', 'Penang', 'Langkawi'], carrier: 'Maxis', gradient: '#667eea, #764ba2', price: 3 },
  { name: 'Indonesia', slug: 'indonesia', code: 'ID', region: 'Asia', emoji: '🇮🇩', cities: ['Jakarta', 'Bali', 'Yogyakarta'], carrier: 'Telkomsel', gradient: '#e53e3e, #764ba2', price: 3 },
  { name: 'Philippines', slug: 'philippines', code: 'PH', region: 'Asia', emoji: '🇵🇭', cities: ['Manila', 'Cebu', 'Boracay'], carrier: 'Globe', gradient: '#667eea, #764ba2', price: 3 },
  { name: 'India', slug: 'india', code: 'IN', region: 'Asia', emoji: '🇮🇳', cities: ['Delhi', 'Mumbai', 'Bangalore'], carrier: 'Jio', gradient: '#dd6b20, #e53e3e', price: 3 },
  { name: 'Taiwan', slug: 'taiwan', code: 'TW', region: 'Asia', emoji: '🇹🇼', cities: ['Taipei', 'Kaohsiung', 'Taichung'], carrier: 'Chunghwa', gradient: '#667eea, #764ba2', price: 4 },
  { name: 'Hong Kong', slug: 'hong-kong', code: 'HK', region: 'Asia', emoji: '🇭🇰', cities: ['Hong Kong'], carrier: 'CSL', gradient: '#e53e3e, #764ba2', price: 4 },
  { name: 'Macau', slug: 'macau', code: 'MO', region: 'Asia', emoji: '🇲🇴', cities: ['Macau'], carrier: 'CTM', gradient: '#667eea, #38a169', price: 4 },
  { name: 'Cambodia', slug: 'cambodia', code: 'KH', region: 'Asia', emoji: '🇰🇭', cities: ['Phnom Penh', 'Siem Reap'], carrier: 'Smart', gradient: '#667eea, #764ba2', price: 3 },
  { name: 'Myanmar', slug: 'myanmar', code: 'MM', region: 'Asia', emoji: '🇲🇲', cities: ['Yangon', 'Mandalay'], carrier: 'MPT', gradient: '#38a169, #667eea', price: 4 },
  { name: 'Laos', slug: 'laos', code: 'LA', region: 'Asia', emoji: '🇱🇦', cities: ['Vientiane', 'Luang Prabang'], carrier: 'LaoTelecom', gradient: '#e53e3e, #667eea', price: 4 },
  { name: 'Sri Lanka', slug: 'sri-lanka', code: 'LK', region: 'Asia', emoji: '🇱🇰', cities: ['Colombo', 'Kandy'], carrier: 'Dialog', gradient: '#dd6b20, #e53e3e', price: 3 },
  { name: 'Nepal', slug: 'nepal', code: 'NP', region: 'Asia', emoji: '🇳🇵', cities: ['Kathmandu', 'Pokhara'], carrier: 'Ncell', gradient: '#e53e3e, #667eea', price: 4 },
  { name: 'Bangladesh', slug: 'bangladesh', code: 'BD', region: 'Asia', emoji: '🇧🇩', cities: ['Dhaka', 'Chittagong'], carrier: 'Grameenphone', gradient: '#38a169, #667eea', price: 3 },
  { name: 'Pakistan', slug: 'pakistan', code: 'PK', region: 'Asia', emoji: '🇵🇰', cities: ['Karachi', 'Lahore', 'Islamabad'], carrier: 'Jazz', gradient: '#38a169, #667eea', price: 3 },
  { name: 'Mongolia', slug: 'mongolia', code: 'MN', region: 'Asia', emoji: '🇲🇳', cities: ['Ulaanbaatar'], carrier: 'Mobicom', gradient: '#667eea, #e53e3e', price: 5 },
  { name: 'Brunei', slug: 'brunei', code: 'BN', region: 'Asia', emoji: '🇧🇳', cities: ['Bandar Seri Begawan'], carrier: 'DST', gradient: '#dd6b20, #764ba2', price: 5 },
  { name: 'Maldives', slug: 'maldives', code: 'MV', region: 'Asia', emoji: '🇲🇻', cities: ['Malé'], carrier: 'Dhiraagu', gradient: '#667eea, #38a169', price: 6 },
  // Middle East
  { name: 'United Arab Emirates', slug: 'uae', code: 'AE', region: 'Middle East', emoji: '🇦🇪', cities: ['Dubai', 'Abu Dhabi'], carrier: 'Etisalat', gradient: '#38a169, #667eea', price: 5 },
  { name: 'Saudi Arabia', slug: 'saudi-arabia', code: 'SA', region: 'Middle East', emoji: '🇸🇦', cities: ['Riyadh', 'Jeddah', 'Mecca'], carrier: 'STC', gradient: '#38a169, #667eea', price: 5 },
  { name: 'Qatar', slug: 'qatar', code: 'QA', region: 'Middle East', emoji: '🇶🇦', cities: ['Doha'], carrier: 'Ooredoo', gradient: '#764ba2, #e53e3e', price: 5 },
  { name: 'Bahrain', slug: 'bahrain', code: 'BH', region: 'Middle East', emoji: '🇧🇭', cities: ['Manama'], carrier: 'Batelco', gradient: '#e53e3e, #667eea', price: 5 },
  { name: 'Kuwait', slug: 'kuwait', code: 'KW', region: 'Middle East', emoji: '🇰🇼', cities: ['Kuwait City'], carrier: 'Zain', gradient: '#38a169, #667eea', price: 5 },
  { name: 'Oman', slug: 'oman', code: 'OM', region: 'Middle East', emoji: '🇴🇲', cities: ['Muscat'], carrier: 'Omantel', gradient: '#38a169, #e53e3e', price: 5 },
  { name: 'Jordan', slug: 'jordan', code: 'JO', region: 'Middle East', emoji: '🇯🇴', cities: ['Amman', 'Petra'], carrier: 'Zain', gradient: '#e53e3e, #38a169', price: 4 },
  { name: 'Lebanon', slug: 'lebanon', code: 'LB', region: 'Middle East', emoji: '🇱🇧', cities: ['Beirut'], carrier: 'Alfa', gradient: '#e53e3e, #38a169', price: 5 },
  { name: 'Israel', slug: 'israel', code: 'IL', region: 'Middle East', emoji: '🇮🇱', cities: ['Tel Aviv', 'Jerusalem'], carrier: 'Cellcom', gradient: '#667eea, #764ba2', price: 5 },
  { name: 'Turkey', slug: 'turkey', code: 'TR', region: 'Middle East', emoji: '🇹🇷', cities: ['Istanbul', 'Ankara', 'Antalya'], carrier: 'Turkcell', gradient: '#e53e3e, #667eea', price: 4 },
  { name: 'Iraq', slug: 'iraq', code: 'IQ', region: 'Middle East', emoji: '🇮🇶', cities: ['Baghdad', 'Erbil'], carrier: 'Asiacell', gradient: '#e53e3e, #38a169', price: 6 },
  { name: 'Iran', slug: 'iran', code: 'IR', region: 'Middle East', emoji: '🇮🇷', cities: ['Tehran', 'Isfahan'], carrier: 'MCI', gradient: '#38a169, #e53e3e', price: 6 },
  // Europe
  { name: 'United Kingdom', slug: 'uk', code: 'GB', region: 'Europe', emoji: '🇬🇧', cities: ['London', 'Manchester', 'Edinburgh'], carrier: 'EE', gradient: '#667eea, #764ba2', price: 4 },
  { name: 'France', slug: 'france', code: 'FR', region: 'Europe', emoji: '🇫🇷', cities: ['Paris', 'Nice', 'Lyon'], carrier: 'Orange', gradient: '#667eea, #764ba2', price: 4 },
  { name: 'Germany', slug: 'germany', code: 'DE', region: 'Europe', emoji: '🇩🇪', cities: ['Berlin', 'Munich', 'Frankfurt'], carrier: 'Deutsche Telekom', gradient: '#e53e3e, #764ba2', price: 4 },
  { name: 'Italy', slug: 'italy', code: 'IT', region: 'Europe', emoji: '🇮🇹', cities: ['Rome', 'Milan', 'Venice'], carrier: 'TIM', gradient: '#38a169, #e53e3e', price: 4 },
  { name: 'Spain', slug: 'spain', code: 'ES', region: 'Europe', emoji: '🇪🇸', cities: ['Madrid', 'Barcelona', 'Seville'], carrier: 'Movistar', gradient: '#e53e3e, #dd6b20', price: 4 },
  { name: 'Portugal', slug: 'portugal', code: 'PT', region: 'Europe', emoji: '🇵🇹', cities: ['Lisbon', 'Porto'], carrier: 'MEO', gradient: '#38a169, #e53e3e', price: 4 },
  { name: 'Netherlands', slug: 'netherlands', code: 'NL', region: 'Europe', emoji: '🇳🇱', cities: ['Amsterdam', 'Rotterdam'], carrier: 'KPN', gradient: '#dd6b20, #667eea', price: 4 },
  { name: 'Belgium', slug: 'belgium', code: 'BE', region: 'Europe', emoji: '🇧🇪', cities: ['Brussels', 'Bruges'], carrier: 'Proximus', gradient: '#dd6b20, #e53e3e', price: 4 },
  { name: 'Switzerland', slug: 'switzerland', code: 'CH', region: 'Europe', emoji: '🇨🇭', cities: ['Zurich', 'Geneva'], carrier: 'Swisscom', gradient: '#e53e3e, #667eea', price: 5 },
  { name: 'Austria', slug: 'austria', code: 'AT', region: 'Europe', emoji: '🇦🇹', cities: ['Vienna', 'Salzburg'], carrier: 'A1', gradient: '#e53e3e, #764ba2', price: 4 },
  { name: 'Greece', slug: 'greece', code: 'GR', region: 'Europe', emoji: '🇬🇷', cities: ['Athens', 'Santorini', 'Mykonos'], carrier: 'Cosmote', gradient: '#667eea, #38a169', price: 4 },
  { name: 'Sweden', slug: 'sweden', code: 'SE', region: 'Europe', emoji: '🇸🇪', cities: ['Stockholm', 'Gothenburg'], carrier: 'Telia', gradient: '#667eea, #dd6b20', price: 4 },
  { name: 'Norway', slug: 'norway', code: 'NO', region: 'Europe', emoji: '🇳🇴', cities: ['Oslo', 'Bergen'], carrier: 'Telenor', gradient: '#667eea, #e53e3e', price: 5 },
  { name: 'Denmark', slug: 'denmark', code: 'DK', region: 'Europe', emoji: '🇩🇰', cities: ['Copenhagen'], carrier: 'TDC', gradient: '#e53e3e, #667eea', price: 4 },
  { name: 'Finland', slug: 'finland', code: 'FI', region: 'Europe', emoji: '🇫🇮', cities: ['Helsinki'], carrier: 'Elisa', gradient: '#667eea, #764ba2', price: 4 },
  { name: 'Ireland', slug: 'ireland', code: 'IE', region: 'Europe', emoji: '🇮🇪', cities: ['Dublin'], carrier: 'Vodafone', gradient: '#38a169, #667eea', price: 4 },
  { name: 'Poland', slug: 'poland', code: 'PL', region: 'Europe', emoji: '🇵🇱', cities: ['Warsaw', 'Krakow'], carrier: 'Plus', gradient: '#e53e3e, #764ba2', price: 3 },
  { name: 'Czech Republic', slug: 'czech-republic', code: 'CZ', region: 'Europe', emoji: '🇨🇿', cities: ['Prague'], carrier: 'T-Mobile', gradient: '#667eea, #e53e3e', price: 3 },
  { name: 'Hungary', slug: 'hungary', code: 'HU', region: 'Europe', emoji: '🇭🇺', cities: ['Budapest'], carrier: 'Telekom', gradient: '#e53e3e, #38a169', price: 3 },
  { name: 'Romania', slug: 'romania', code: 'RO', region: 'Europe', emoji: '🇷🇴', cities: ['Bucharest'], carrier: 'Vodafone', gradient: '#667eea, #dd6b20', price: 3 },
  { name: 'Croatia', slug: 'croatia', code: 'HR', region: 'Europe', emoji: '🇭🇷', cities: ['Zagreb', 'Dubrovnik'], carrier: 'HT', gradient: '#667eea, #e53e3e', price: 4 },
  { name: 'Bulgaria', slug: 'bulgaria', code: 'BG', region: 'Europe', emoji: '🇧🇬', cities: ['Sofia'], carrier: 'A1', gradient: '#38a169, #e53e3e', price: 3 },
  { name: 'Serbia', slug: 'serbia', code: 'RS', region: 'Europe', emoji: '🇷🇸', cities: ['Belgrade'], carrier: 'Telekom', gradient: '#e53e3e, #667eea', price: 3 },
  { name: 'Slovakia', slug: 'slovakia', code: 'SK', region: 'Europe', emoji: '🇸🇰', cities: ['Bratislava'], carrier: 'Slovak Telekom', gradient: '#667eea, #e53e3e', price: 3 },
  { name: 'Slovenia', slug: 'slovenia', code: 'SI', region: 'Europe', emoji: '🇸🇮', cities: ['Ljubljana'], carrier: 'Telekom', gradient: '#38a169, #667eea', price: 4 },
  { name: 'Estonia', slug: 'estonia', code: 'EE', region: 'Europe', emoji: '🇪🇪', cities: ['Tallinn'], carrier: 'Telia', gradient: '#667eea, #764ba2', price: 4 },
  { name: 'Latvia', slug: 'latvia', code: 'LV', region: 'Europe', emoji: '🇱🇻', cities: ['Riga'], carrier: 'LMT', gradient: '#764ba2, #e53e3e', price: 4 },
  { name: 'Lithuania', slug: 'lithuania', code: 'LT', region: 'Europe', emoji: '🇱🇹', cities: ['Vilnius'], carrier: 'Telia', gradient: '#38a169, #dd6b20', price: 4 },
  { name: 'Iceland', slug: 'iceland', code: 'IS', region: 'Europe', emoji: '🇮🇸', cities: ['Reykjavik'], carrier: 'Siminn', gradient: '#667eea, #764ba2', price: 6 },
  { name: 'Luxembourg', slug: 'luxembourg', code: 'LU', region: 'Europe', emoji: '🇱🇺', cities: ['Luxembourg City'], carrier: 'POST', gradient: '#667eea, #e53e3e', price: 4 },
  { name: 'Malta', slug: 'malta', code: 'MT', region: 'Europe', emoji: '🇲🇹', cities: ['Valletta'], carrier: 'GO', gradient: '#e53e3e, #667eea', price: 4 },
  { name: 'Cyprus', slug: 'cyprus', code: 'CY', region: 'Europe', emoji: '🇨🇾', cities: ['Nicosia', 'Limassol'], carrier: 'Cyta', gradient: '#dd6b20, #667eea', price: 4 },
  { name: 'Albania', slug: 'albania', code: 'AL', region: 'Europe', emoji: '🇦🇱', cities: ['Tirana'], carrier: 'Vodafone', gradient: '#e53e3e, #764ba2', price: 4 },
  { name: 'North Macedonia', slug: 'north-macedonia', code: 'MK', region: 'Europe', emoji: '🇲🇰', cities: ['Skopje'], carrier: 'Makedonski Telekom', gradient: '#e53e3e, #dd6b20', price: 4 },
  { name: 'Montenegro', slug: 'montenegro', code: 'ME', region: 'Europe', emoji: '🇲🇪', cities: ['Podgorica'], carrier: 'Crnogorski Telekom', gradient: '#667eea, #38a169', price: 4 },
  { name: 'Bosnia and Herzegovina', slug: 'bosnia', code: 'BA', region: 'Europe', emoji: '🇧🇦', cities: ['Sarajevo'], carrier: 'BH Telecom', gradient: '#667eea, #dd6b20', price: 4 },
  { name: 'Moldova', slug: 'moldova', code: 'MD', region: 'Europe', emoji: '🇲🇩', cities: ['Chisinau'], carrier: 'Orange', gradient: '#667eea, #e53e3e', price: 4 },
  { name: 'Ukraine', slug: 'ukraine', code: 'UA', region: 'Europe', emoji: '🇺🇦', cities: ['Kyiv', 'Lviv', 'Odesa'], carrier: 'Kyivstar', gradient: '#667eea, #dd6b20', price: 4 },
  { name: 'Georgia', slug: 'georgia', code: 'GE', region: 'Europe', emoji: '🇬🇪', cities: ['Tbilisi', 'Batumi'], carrier: 'Magticom', gradient: '#e53e3e, #764ba2', price: 4 },
  { name: 'Armenia', slug: 'armenia', code: 'AM', region: 'Europe', emoji: '🇦🇲', cities: ['Yerevan'], carrier: 'Ucom', gradient: '#dd6b20, #667eea', price: 4 },
  { name: 'Azerbaijan', slug: 'azerbaijan', code: 'AZ', region: 'Europe', emoji: '🇦🇿', cities: ['Baku'], carrier: 'Azercell', gradient: '#667eea, #38a169', price: 4 },
  { name: 'Russia', slug: 'russia', code: 'RU', region: 'Europe', emoji: '🇷🇺', cities: ['Moscow', 'St. Petersburg'], carrier: 'MTS', gradient: '#e53e3e, #667eea', price: 5 },
  { name: 'Belarus', slug: 'belarus', code: 'BY', region: 'Europe', emoji: '🇧🇾', cities: ['Minsk'], carrier: 'A1', gradient: '#38a169, #e53e3e', price: 5 },
  // North America
  { name: 'United States', slug: 'usa', code: 'US', region: 'North America', emoji: '🇺🇸', cities: ['New York', 'Los Angeles', 'San Francisco'], carrier: 'AT&T', gradient: '#667eea, #764ba2', price: 5 },
  { name: 'Canada', slug: 'canada', code: 'CA', region: 'North America', emoji: '🇨🇦', cities: ['Toronto', 'Vancouver', 'Montreal'], carrier: 'Rogers', gradient: '#e53e3e, #667eea', price: 5 },
  { name: 'Mexico', slug: 'mexico', code: 'MX', region: 'North America', emoji: '🇲🇽', cities: ['Mexico City', 'Cancun', 'Guadalajara'], carrier: 'Telcel', gradient: '#38a169, #e53e3e', price: 4 },
  // Central America & Caribbean
  { name: 'Costa Rica', slug: 'costa-rica', code: 'CR', region: 'Central America', emoji: '🇨🇷', cities: ['San José'], carrier: 'Kolbi', gradient: '#667eea, #38a169', price: 5 },
  { name: 'Panama', slug: 'panama', code: 'PA', region: 'Central America', emoji: '🇵🇦', cities: ['Panama City'], carrier: 'Movistar', gradient: '#667eea, #e53e3e', price: 5 },
  { name: 'Guatemala', slug: 'guatemala', code: 'GT', region: 'Central America', emoji: '🇬🇹', cities: ['Guatemala City'], carrier: 'Tigo', gradient: '#667eea, #38a169', price: 5 },
  { name: 'Honduras', slug: 'honduras', code: 'HN', region: 'Central America', emoji: '🇭🇳', cities: ['Tegucigalpa'], carrier: 'Tigo', gradient: '#667eea, #764ba2', price: 5 },
  { name: 'El Salvador', slug: 'el-salvador', code: 'SV', region: 'Central America', emoji: '🇸🇻', cities: ['San Salvador'], carrier: 'Tigo', gradient: '#667eea, #764ba2', price: 5 },
  { name: 'Nicaragua', slug: 'nicaragua', code: 'NI', region: 'Central America', emoji: '🇳🇮', cities: ['Managua'], carrier: 'Claro', gradient: '#667eea, #764ba2', price: 5 },
  { name: 'Belize', slug: 'belize', code: 'BZ', region: 'Central America', emoji: '🇧🇿', cities: ['Belize City'], carrier: 'DigiCell', gradient: '#667eea, #38a169', price: 6 },
  { name: 'Jamaica', slug: 'jamaica', code: 'JM', region: 'Caribbean', emoji: '🇯🇲', cities: ['Kingston'], carrier: 'Digicel', gradient: '#38a169, #dd6b20', price: 5 },
  { name: 'Dominican Republic', slug: 'dominican-republic', code: 'DO', region: 'Caribbean', emoji: '🇩🇴', cities: ['Santo Domingo', 'Punta Cana'], carrier: 'Claro', gradient: '#667eea, #e53e3e', price: 5 },
  { name: 'Cuba', slug: 'cuba', code: 'CU', region: 'Caribbean', emoji: '🇨🇺', cities: ['Havana'], carrier: 'ETECSA', gradient: '#667eea, #e53e3e', price: 8 },
  { name: 'Puerto Rico', slug: 'puerto-rico', code: 'PR', region: 'Caribbean', emoji: '🇵🇷', cities: ['San Juan'], carrier: 'T-Mobile', gradient: '#667eea, #e53e3e', price: 5 },
  { name: 'Trinidad and Tobago', slug: 'trinidad-tobago', code: 'TT', region: 'Caribbean', emoji: '🇹🇹', cities: ['Port of Spain'], carrier: 'Digicel', gradient: '#e53e3e, #764ba2', price: 5 },
  { name: 'Bahamas', slug: 'bahamas', code: 'BS', region: 'Caribbean', emoji: '🇧🇸', cities: ['Nassau'], carrier: 'BTC', gradient: '#667eea, #dd6b20', price: 6 },
  { name: 'Barbados', slug: 'barbados', code: 'BB', region: 'Caribbean', emoji: '🇧🇧', cities: ['Bridgetown'], carrier: 'Digicel', gradient: '#667eea, #dd6b20', price: 6 },
  { name: 'Haiti', slug: 'haiti', code: 'HT', region: 'Caribbean', emoji: '🇭🇹', cities: ['Port-au-Prince'], carrier: 'Digicel', gradient: '#667eea, #e53e3e', price: 6 },
  // South America
  { name: 'Brazil', slug: 'brazil', code: 'BR', region: 'South America', emoji: '🇧🇷', cities: ['São Paulo', 'Rio de Janeiro', 'Salvador'], carrier: 'Vivo', gradient: '#38a169, #dd6b20', price: 4 },
  { name: 'Argentina', slug: 'argentina', code: 'AR', region: 'South America', emoji: '🇦🇷', cities: ['Buenos Aires'], carrier: 'Claro', gradient: '#667eea, #764ba2', price: 4 },
  { name: 'Chile', slug: 'chile', code: 'CL', region: 'South America', emoji: '🇨🇱', cities: ['Santiago'], carrier: 'Entel', gradient: '#e53e3e, #667eea', price: 4 },
  { name: 'Colombia', slug: 'colombia', code: 'CO', region: 'South America', emoji: '🇨🇴', cities: ['Bogotá', 'Medellín', 'Cartagena'], carrier: 'Claro', gradient: '#dd6b20, #667eea', price: 4 },
  { name: 'Peru', slug: 'peru', code: 'PE', region: 'South America', emoji: '🇵🇪', cities: ['Lima', 'Cusco'], carrier: 'Claro', gradient: '#e53e3e, #764ba2', price: 4 },
  { name: 'Ecuador', slug: 'ecuador', code: 'EC', region: 'South America', emoji: '🇪🇨', cities: ['Quito', 'Guayaquil'], carrier: 'Claro', gradient: '#dd6b20, #667eea', price: 4 },
  { name: 'Venezuela', slug: 'venezuela', code: 'VE', region: 'South America', emoji: '🇻🇪', cities: ['Caracas'], carrier: 'Movistar', gradient: '#dd6b20, #e53e3e', price: 5 },
  { name: 'Bolivia', slug: 'bolivia', code: 'BO', region: 'South America', emoji: '🇧🇴', cities: ['La Paz'], carrier: 'Tigo', gradient: '#38a169, #e53e3e', price: 5 },
  { name: 'Paraguay', slug: 'paraguay', code: 'PY', region: 'South America', emoji: '🇵🇾', cities: ['Asunción'], carrier: 'Tigo', gradient: '#e53e3e, #667eea', price: 5 },
  { name: 'Uruguay', slug: 'uruguay', code: 'UY', region: 'South America', emoji: '🇺🇾', cities: ['Montevideo'], carrier: 'Antel', gradient: '#667eea, #764ba2', price: 4 },
  { name: 'Guyana', slug: 'guyana', code: 'GY', region: 'South America', emoji: '🇬🇾', cities: ['Georgetown'], carrier: 'GTT', gradient: '#38a169, #dd6b20', price: 6 },
  { name: 'Suriname', slug: 'suriname', code: 'SR', region: 'South America', emoji: '🇸🇷', cities: ['Paramaribo'], carrier: 'Digicel', gradient: '#38a169, #e53e3e', price: 6 },
  // Africa
  { name: 'South Africa', slug: 'south-africa', code: 'ZA', region: 'Africa', emoji: '🇿🇦', cities: ['Cape Town', 'Johannesburg'], carrier: 'Vodacom', gradient: '#38a169, #667eea', price: 4 },
  { name: 'Egypt', slug: 'egypt', code: 'EG', region: 'Africa', emoji: '🇪🇬', cities: ['Cairo', 'Alexandria'], carrier: 'Vodafone', gradient: '#dd6b20, #e53e3e', price: 4 },
  { name: 'Morocco', slug: 'morocco', code: 'MA', region: 'Africa', emoji: '🇲🇦', cities: ['Marrakech', 'Casablanca'], carrier: 'Maroc Telecom', gradient: '#e53e3e, #38a169', price: 4 },
  { name: 'Nigeria', slug: 'nigeria', code: 'NG', region: 'Africa', emoji: '🇳🇬', cities: ['Lagos', 'Abuja'], carrier: 'MTN', gradient: '#38a169, #dd6b20', price: 4 },
  { name: 'Kenya', slug: 'kenya', code: 'KE', region: 'Africa', emoji: '🇰🇪', cities: ['Nairobi', 'Mombasa'], carrier: 'Safaricom', gradient: '#38a169, #e53e3e', price: 4 },
  { name: 'Tanzania', slug: 'tanzania', code: 'TZ', region: 'Africa', emoji: '🇹🇿', cities: ['Dar es Salaam', 'Zanzibar'], carrier: 'Vodacom', gradient: '#667eea, #38a169', price: 4 },
  { name: 'Ethiopia', slug: 'ethiopia', code: 'ET', region: 'Africa', emoji: '🇪🇹', cities: ['Addis Ababa'], carrier: 'Ethio Telecom', gradient: '#38a169, #dd6b20', price: 5 },
  { name: 'Ghana', slug: 'ghana', code: 'GH', region: 'Africa', emoji: '🇬🇭', cities: ['Accra'], carrier: 'MTN', gradient: '#dd6b20, #38a169', price: 4 },
  { name: 'Tunisia', slug: 'tunisia', code: 'TN', region: 'Africa', emoji: '🇹🇳', cities: ['Tunis'], carrier: 'Ooredoo', gradient: '#e53e3e, #667eea', price: 4 },
  { name: 'Algeria', slug: 'algeria', code: 'DZ', region: 'Africa', emoji: '🇩🇿', cities: ['Algiers'], carrier: 'Djezzy', gradient: '#38a169, #e53e3e', price: 5 },
  { name: 'Uganda', slug: 'uganda', code: 'UG', region: 'Africa', emoji: '🇺🇬', cities: ['Kampala'], carrier: 'MTN', gradient: '#dd6b20, #e53e3e', price: 4 },
  { name: 'Rwanda', slug: 'rwanda', code: 'RW', region: 'Africa', emoji: '🇷🇼', cities: ['Kigali'], carrier: 'MTN', gradient: '#667eea, #38a169', price: 5 },
  { name: 'Senegal', slug: 'senegal', code: 'SN', region: 'Africa', emoji: '🇸🇳', cities: ['Dakar'], carrier: 'Orange', gradient: '#38a169, #dd6b20', price: 5 },
  { name: 'Ivory Coast', slug: 'ivory-coast', code: 'CI', region: 'Africa', emoji: '🇨🇮', cities: ['Abidjan'], carrier: 'Orange', gradient: '#dd6b20, #38a169', price: 5 },
  { name: 'Cameroon', slug: 'cameroon', code: 'CM', region: 'Africa', emoji: '🇨🇲', cities: ['Douala', 'Yaoundé'], carrier: 'MTN', gradient: '#38a169, #dd6b20', price: 5 },
  { name: 'Mozambique', slug: 'mozambique', code: 'MZ', region: 'Africa', emoji: '🇲🇿', cities: ['Maputo'], carrier: 'Vodacom', gradient: '#e53e3e, #38a169', price: 5 },
  { name: 'Zimbabwe', slug: 'zimbabwe', code: 'ZW', region: 'Africa', emoji: '🇿🇼', cities: ['Harare'], carrier: 'Econet', gradient: '#38a169, #dd6b20', price: 5 },
  { name: 'Zambia', slug: 'zambia', code: 'ZM', region: 'Africa', emoji: '🇿🇲', cities: ['Lusaka'], carrier: 'MTN', gradient: '#38a169, #e53e3e', price: 5 },
  { name: 'Botswana', slug: 'botswana', code: 'BW', region: 'Africa', emoji: '🇧🇼', cities: ['Gaborone'], carrier: 'Mascom', gradient: '#667eea, #38a169', price: 5 },
  { name: 'Namibia', slug: 'namibia', code: 'NA', region: 'Africa', emoji: '🇳🇦', cities: ['Windhoek'], carrier: 'MTC', gradient: '#667eea, #dd6b20', price: 5 },
  { name: 'Mauritius', slug: 'mauritius', code: 'MU', region: 'Africa', emoji: '🇲🇺', cities: ['Port Louis'], carrier: 'Orange', gradient: '#e53e3e, #667eea', price: 5 },
  { name: 'Madagascar', slug: 'madagascar', code: 'MG', region: 'Africa', emoji: '🇲🇬', cities: ['Antananarivo'], carrier: 'Orange', gradient: '#38a169, #e53e3e', price: 6 },
  { name: 'Libya', slug: 'libya', code: 'LY', region: 'Africa', emoji: '🇱🇾', cities: ['Tripoli'], carrier: 'Libyana', gradient: '#38a169, #e53e3e', price: 7 },
  { name: 'Angola', slug: 'angola', code: 'AO', region: 'Africa', emoji: '🇦🇴', cities: ['Luanda'], carrier: 'Unitel', gradient: '#e53e3e, #764ba2', price: 6 },
  { name: 'DR Congo', slug: 'dr-congo', code: 'CD', region: 'Africa', emoji: '🇨🇩', cities: ['Kinshasa'], carrier: 'Vodacom', gradient: '#667eea, #dd6b20', price: 6 },
  { name: 'Mali', slug: 'mali', code: 'ML', region: 'Africa', emoji: '🇲🇱', cities: ['Bamako'], carrier: 'Orange', gradient: '#38a169, #dd6b20', price: 6 },
  { name: 'Burkina Faso', slug: 'burkina-faso', code: 'BF', region: 'Africa', emoji: '🇧🇫', cities: ['Ouagadougou'], carrier: 'Orange', gradient: '#e53e3e, #38a169', price: 6 },
  { name: 'Niger', slug: 'niger', code: 'NE', region: 'Africa', emoji: '🇳🇪', cities: ['Niamey'], carrier: 'Airtel', gradient: '#dd6b20, #38a169', price: 6 },
  { name: 'Chad', slug: 'chad', code: 'TD', region: 'Africa', emoji: '🇹🇩', cities: ['N\'Djamena'], carrier: 'Airtel', gradient: '#667eea, #dd6b20', price: 7 },
  { name: 'Guinea', slug: 'guinea', code: 'GN', region: 'Africa', emoji: '🇬🇳', cities: ['Conakry'], carrier: 'Orange', gradient: '#e53e3e, #38a169', price: 6 },
  { name: 'Benin', slug: 'benin', code: 'BJ', region: 'Africa', emoji: '🇧🇯', cities: ['Cotonou'], carrier: 'MTN', gradient: '#38a169, #dd6b20', price: 6 },
  { name: 'Togo', slug: 'togo', code: 'TG', region: 'Africa', emoji: '🇹🇬', cities: ['Lomé'], carrier: 'Togocel', gradient: '#38a169, #dd6b20', price: 6 },
  { name: 'Sierra Leone', slug: 'sierra-leone', code: 'SL', region: 'Africa', emoji: '🇸🇱', cities: ['Freetown'], carrier: 'Orange', gradient: '#38a169, #667eea', price: 7 },
  { name: 'Liberia', slug: 'liberia', code: 'LR', region: 'Africa', emoji: '🇱🇷', cities: ['Monrovia'], carrier: 'Lonestar', gradient: '#e53e3e, #667eea', price: 7 },
  { name: 'Gambia', slug: 'gambia', code: 'GM', region: 'Africa', emoji: '🇬🇲', cities: ['Banjul'], carrier: 'Africell', gradient: '#e53e3e, #38a169', price: 6 },
  { name: 'Cape Verde', slug: 'cape-verde', code: 'CV', region: 'Africa', emoji: '🇨🇻', cities: ['Praia'], carrier: 'CV Móvel', gradient: '#667eea, #dd6b20', price: 6 },
  { name: 'Mauritania', slug: 'mauritania', code: 'MR', region: 'Africa', emoji: '🇲🇷', cities: ['Nouakchott'], carrier: 'Mauritel', gradient: '#38a169, #dd6b20', price: 7 },
  { name: 'Eswatini', slug: 'eswatini', code: 'SZ', region: 'Africa', emoji: '🇸🇿', cities: ['Mbabane'], carrier: 'MTN', gradient: '#667eea, #dd6b20', price: 6 },
  { name: 'Lesotho', slug: 'lesotho', code: 'LS', region: 'Africa', emoji: '🇱🇸', cities: ['Maseru'], carrier: 'Vodacom', gradient: '#667eea, #38a169', price: 6 },
  { name: 'Gabon', slug: 'gabon', code: 'GA', region: 'Africa', emoji: '🇬🇦', cities: ['Libreville'], carrier: 'Airtel', gradient: '#38a169, #667eea', price: 6 },
  { name: 'Congo', slug: 'congo', code: 'CG', region: 'Africa', emoji: '🇨🇬', cities: ['Brazzaville'], carrier: 'MTN', gradient: '#38a169, #e53e3e', price: 6 },
  { name: 'Equatorial Guinea', slug: 'equatorial-guinea', code: 'GQ', region: 'Africa', emoji: '🇬🇶', cities: ['Malabo'], carrier: 'Orange', gradient: '#38a169, #e53e3e', price: 7 },
  { name: 'Central African Republic', slug: 'central-african-republic', code: 'CF', region: 'Africa', emoji: '🇨🇫', cities: ['Bangui'], carrier: 'Orange', gradient: '#667eea, #38a169', price: 8 },
  { name: 'South Sudan', slug: 'south-sudan', code: 'SS', region: 'Africa', emoji: '🇸🇸', cities: ['Juba'], carrier: 'MTN', gradient: '#38a169, #e53e3e', price: 8 },
  { name: 'Sudan', slug: 'sudan', code: 'SD', region: 'Africa', emoji: '🇸🇩', cities: ['Khartoum'], carrier: 'MTN', gradient: '#38a169, #e53e3e', price: 7 },
  { name: 'Somalia', slug: 'somalia', code: 'SO', region: 'Africa', emoji: '🇸🇴', cities: ['Mogadishu'], carrier: 'Hormuud', gradient: '#667eea, #38a169', price: 7 },
  { name: 'Djibouti', slug: 'djibouti', code: 'DJ', region: 'Africa', emoji: '🇩🇯', cities: ['Djibouti City'], carrier: 'Djibouti Telecom', gradient: '#38a169, #667eea', price: 7 },
  { name: 'Eritrea', slug: 'eritrea', code: 'ER', region: 'Africa', emoji: '🇪🇷', cities: ['Asmara'], carrier: 'EriTel', gradient: '#667eea, #e53e3e', price: 8 },
  { name: 'Comoros', slug: 'comoros', code: 'KM', region: 'Africa', emoji: '🇰🇲', cities: ['Moroni'], carrier: 'Comores Telecom', gradient: '#38a169, #667eea', price: 7 },
  { name: 'Seychelles', slug: 'seychelles', code: 'SC', region: 'Africa', emoji: '🇸🇨', cities: ['Victoria'], carrier: 'Airtel', gradient: '#667eea, #38a169', price: 6 },
  { name: 'São Tomé and Príncipe', slug: 'sao-tome', code: 'ST', region: 'Africa', emoji: '🇸🇹', cities: ['São Tomé'], carrier: 'CST', gradient: '#38a169, #dd6b20', price: 8 },
  { name: 'Guinea-Bissau', slug: 'guinea-bissau', code: 'GW', region: 'Africa', emoji: '🇬🇼', cities: ['Bissau'], carrier: 'Orange', gradient: '#e53e3e, #38a169', price: 7 },
  // Oceania
  { name: 'Australia', slug: 'australia', code: 'AU', region: 'Oceania', emoji: '🇦🇺', cities: ['Sydney', 'Melbourne', 'Brisbane'], carrier: 'Telstra', gradient: '#667eea, #38a169', price: 5 },
  { name: 'New Zealand', slug: 'new-zealand', code: 'NZ', region: 'Oceania', emoji: '🇳🇿', cities: ['Auckland', 'Wellington'], carrier: 'Spark', gradient: '#667eea, #38a169', price: 5 },
  { name: 'Fiji', slug: 'fiji', code: 'FJ', region: 'Oceania', emoji: '🇫🇯', cities: ['Suva'], carrier: 'Vodafone', gradient: '#667eea, #38a169', price: 6 },
  { name: 'Papua New Guinea', slug: 'papua-new-guinea', code: 'PG', region: 'Oceania', emoji: '🇵🇬', cities: ['Port Moresby'], carrier: 'Digicel', gradient: '#e53e3e, #dd6b20', price: 7 },
  { name: 'Samoa', slug: 'samoa', code: 'WS', region: 'Oceania', emoji: '🇼🇸', cities: ['Apia'], carrier: 'Digicel', gradient: '#667eea, #38a169', price: 7 },
  { name: 'Tonga', slug: 'tonga', code: 'TO', region: 'Oceania', emoji: '🇹🇴', cities: ['Nukuʻalofa'], carrier: 'Digicel', gradient: '#e53e3e, #764ba2', price: 7 },
  { name: 'Vanuatu', slug: 'vanuatu', code: 'VU', region: 'Oceania', emoji: '🇻🇺', cities: ['Port Vila'], carrier: 'Digicel', gradient: '#38a169, #dd6b20', price: 7 },
  { name: 'Solomon Islands', slug: 'solomon-islands', code: 'SB', region: 'Oceania', emoji: '🇸🇧', cities: ['Honiara'], carrier: 'Our Telekom', gradient: '#38a169, #667eea', price: 8 },
  { name: 'Micronesia', slug: 'micronesia', code: 'FM', region: 'Oceania', emoji: '🇫🇲', cities: ['Palikir'], carrier: 'FSM Telecom', gradient: '#667eea, #38a169', price: 8 },
  { name: 'Palau', slug: 'palau', code: 'PW', region: 'Oceania', emoji: '🇵🇼', cities: ['Ngerulmud'], carrier: 'PNCC', gradient: '#667eea, #dd6b20', price: 8 },
  { name: 'Marshall Islands', slug: 'marshall-islands', code: 'MH', region: 'Oceania', emoji: '🇲🇭', cities: ['Majuro'], carrier: 'NTA', gradient: '#667eea, #764ba2', price: 8 },
  { name: 'Kiribati', slug: 'kiribati', code: 'KI', region: 'Oceania', emoji: '🇰🇮', cities: ['Tarawa'], carrier: 'TSKL', gradient: '#e53e3e, #dd6b20', price: 9 },
  { name: 'Nauru', slug: 'nauru', code: 'NR', region: 'Oceania', emoji: '🇳🇷', cities: ['Yaren'], carrier: 'Digicel', gradient: '#667eea, #dd6b20', price: 9 },
  { name: 'Tuvalu', slug: 'tuvalu', code: 'TV', region: 'Oceania', emoji: '🇹🇻', cities: ['Funafuti'], carrier: 'TTC', gradient: '#667eea, #38a169', price: 9 },
  // Central Asia
  { name: 'Kazakhstan', slug: 'kazakhstan', code: 'KZ', region: 'Central Asia', emoji: '🇰🇿', cities: ['Almaty', 'Astana'], carrier: 'Kcell', gradient: '#667eea, #38a169', price: 4 },
  { name: 'Uzbekistan', slug: 'uzbekistan', code: 'UZ', region: 'Central Asia', emoji: '🇺🇿', cities: ['Tashkent', 'Samarkand'], carrier: 'Ucell', gradient: '#667eea, #38a169', price: 4 },
  { name: 'Kyrgyzstan', slug: 'kyrgyzstan', code: 'KG', region: 'Central Asia', emoji: '🇰🇬', cities: ['Bishkek'], carrier: 'Beeline', gradient: '#e53e3e, #667eea', price: 5 },
  { name: 'Tajikistan', slug: 'tajikistan', code: 'TJ', region: 'Central Asia', emoji: '🇹🇯', cities: ['Dushanbe'], carrier: 'Tcell', gradient: '#e53e3e, #38a169', price: 5 },
  { name: 'Turkmenistan', slug: 'turkmenistan', code: 'TM', region: 'Central Asia', emoji: '🇹🇲', cities: ['Ashgabat'], carrier: 'MTS', gradient: '#38a169, #764ba2', price: 6 },
  { name: 'Afghanistan', slug: 'afghanistan', code: 'AF', region: 'Central Asia', emoji: '🇦🇫', cities: ['Kabul'], carrier: 'Roshan', gradient: '#38a169, #e53e3e', price: 6 },
  // Regional packages
  { name: 'Europe', slug: 'europe', code: 'EU', region: 'Regional', emoji: '🇪🇺', cities: ['Multiple Countries'], carrier: 'Multi-Network', gradient: '#667eea, #764ba2', price: 6 },
  { name: 'Southeast Asia', slug: 'southeast-asia', code: 'SEA', region: 'Regional', emoji: '🌏', cities: ['Multiple Countries'], carrier: 'Multi-Network', gradient: '#38a169, #667eea', price: 5 },
  { name: 'Middle East', slug: 'middle-east', code: 'ME', region: 'Regional', emoji: '🌍', cities: ['Multiple Countries'], carrier: 'Multi-Network', gradient: '#dd6b20, #764ba2', price: 6 },
  { name: 'East Africa', slug: 'east-africa', code: 'EAF', region: 'Regional', emoji: '🌍', cities: ['Multiple Countries'], carrier: 'Multi-Network', gradient: '#38a169, #dd6b20', price: 6 },
  { name: 'West Africa', slug: 'west-africa', code: 'WAF', region: 'Regional', emoji: '🌍', cities: ['Multiple Countries'], carrier: 'Multi-Network', gradient: '#dd6b20, #38a169', price: 6 },
  { name: 'South America', slug: 'south-america', code: 'SA', region: 'Regional', emoji: '🌎', cities: ['Multiple Countries'], carrier: 'Multi-Network', gradient: '#38a169, #dd6b20', price: 6 },
  { name: 'Caribbean', slug: 'caribbean', code: 'CAR', region: 'Regional', emoji: '🌴', cities: ['Multiple Countries'], carrier: 'Multi-Network', gradient: '#667eea, #dd6b20', price: 6 },
  { name: 'Central America', slug: 'central-america', code: 'CAM', region: 'Regional', emoji: '🌎', cities: ['Multiple Countries'], carrier: 'Multi-Network', gradient: '#38a169, #667eea', price: 6 },
  { name: 'North Africa', slug: 'north-africa', code: 'NAF', region: 'Regional', emoji: '🌍', cities: ['Multiple Countries'], carrier: 'Multi-Network', gradient: '#dd6b20, #e53e3e', price: 6 },
  { name: 'Oceania', slug: 'oceania', code: 'OCE', region: 'Regional', emoji: '🌏', cities: ['Multiple Countries'], carrier: 'Multi-Network', gradient: '#667eea, #38a169', price: 7 },
  { name: 'Global', slug: 'global', code: 'GLOBAL', region: 'Regional', emoji: '🌐', cities: ['Worldwide'], carrier: 'Multi-Network', gradient: '#764ba2, #667eea', price: 5 },
];

// Add remaining countries to reach ~200+
const additionalCountries = [
  // More Africa
  { name: 'Malawi', slug: 'malawi', code: 'MW', region: 'Africa' },
  { name: 'Burundi', slug: 'burundi', code: 'BI', region: 'Africa' },
  // More Caribbean  
  { name: 'Antigua and Barbuda', slug: 'antigua-barbuda', code: 'AG', region: 'Caribbean' },
  { name: 'Saint Lucia', slug: 'saint-lucia', code: 'LC', region: 'Caribbean' },
  { name: 'Grenada', slug: 'grenada', code: 'GR2', region: 'Caribbean' },
  { name: 'Saint Vincent', slug: 'saint-vincent', code: 'VC', region: 'Caribbean' },
  { name: 'Dominica', slug: 'dominica', code: 'DM', region: 'Caribbean' },
  { name: 'Saint Kitts and Nevis', slug: 'saint-kitts', code: 'KN', region: 'Caribbean' },
  { name: 'Aruba', slug: 'aruba', code: 'AW', region: 'Caribbean' },
  { name: 'Curaçao', slug: 'curacao', code: 'CW', region: 'Caribbean' },
  // More Europe
  { name: 'Monaco', slug: 'monaco', code: 'MC', region: 'Europe' },
  { name: 'San Marino', slug: 'san-marino', code: 'SM', region: 'Europe' },
  { name: 'Liechtenstein', slug: 'liechtenstein', code: 'LI', region: 'Europe' },
  { name: 'Andorra', slug: 'andorra', code: 'AD', region: 'Europe' },
  { name: 'Kosovo', slug: 'kosovo', code: 'XK', region: 'Europe' },
  // More Asia
  { name: 'Bhutan', slug: 'bhutan', code: 'BT', region: 'Asia' },
  { name: 'Timor-Leste', slug: 'timor-leste', code: 'TL', region: 'Asia' },
  // More Middle East
  { name: 'Yemen', slug: 'yemen', code: 'YE', region: 'Middle East' },
  { name: 'Syria', slug: 'syria', code: 'SY', region: 'Middle East' },
  { name: 'Palestine', slug: 'palestine', code: 'PS', region: 'Middle East' },
  // More Oceania
  { name: 'New Caledonia', slug: 'new-caledonia', code: 'NC', region: 'Oceania' },
  { name: 'French Polynesia', slug: 'french-polynesia', code: 'PF', region: 'Oceania' },
  { name: 'Guam', slug: 'guam', code: 'GU', region: 'Oceania' },
].map(c => ({
  ...c,
  emoji: '🌐',
  cities: [c.name],
  carrier: 'Local Network',
  gradient: '#667eea, #764ba2',
  price: 5 + Math.floor(Math.random() * 3),
}));

const allCountries = [...countries, ...additionalCountries];

function generatePage(country) {
  const citiesText = country.cities.join(', ');
  const isRegional = country.region === 'Regional';
  const typeText = isRegional ? 'Regional' : 'Travel';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${country.name} eSIM — Stay Connected in ${country.name} from $${country.price} | SimRyoko</title>
<meta name="description" content="Best ${country.name} eSIM deals. Instant activation, no physical SIM needed. Data plans from $${country.price}. Buy ${country.name} eSIM online at SimRyoko.">
<meta name="keywords" content="${country.name} eSIM, eSIM ${country.name}, ${country.name} data plan, ${country.name} travel SIM, ${country.name} internet">
<meta property="og:title" content="${country.name} eSIM — From $${country.price} | SimRyoko">
<meta property="og:description" content="Stay connected in ${country.name} with instant eSIM activation. No physical SIM, no roaming fees. Plans from $${country.price}.">
<meta property="og:url" content="https://simryoko.com/countries/${country.slug}-esim">
<meta property="og:image" content="https://simryoko.com/img/og/${country.code.toLowerCase()}-og.jpg">
<link rel="canonical" href="https://simryoko.com/countries/${country.slug}-esim">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<script src="/js/analytics.js"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-5F6FMKR7J4"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-5F6FMKR7J4');</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',-apple-system,sans-serif;color:#1a1a2e}
.nav{background:#fff;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 10px rgba(0,0,0,.08);position:sticky;top:0;z-index:100}
.nav-logo{font-weight:800;font-size:1.3rem;color:#667eea;text-decoration:none}
.nav-links{display:flex;gap:20px;align-items:center}
.nav-links a{color:#555;text-decoration:none;font-size:.95rem}
.nav-cta{background:#667eea;color:#fff!important;padding:10px 24px;border-radius:50px;font-weight:600}
.hero{background:linear-gradient(135deg,${country.gradient});color:#fff;padding:80px 20px;text-align:center}
.hero h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;margin-bottom:16px}
.hero p{font-size:1.2rem;opacity:.9;max-width:600px;margin:0 auto 32px}
.badge{display:inline-block;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.4);border-radius:50px;padding:6px 18px;font-size:.9rem;margin-bottom:20px}
.btn-primary{display:inline-block;background:#fff;color:#667eea;font-weight:700;font-size:1.1rem;padding:16px 40px;border-radius:50px;text-decoration:none;transition:transform .2s}
.btn-primary:hover{transform:translateY(-2px)}
.container{max-width:960px;margin:0 auto;padding:0 20px}
.plans{padding:60px 20px;background:#f8f9ff}
.plans h2{text-align:center;font-size:2rem;margin-bottom:40px}
.plan-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;max-width:900px;margin:0 auto}
.plan-card{background:#fff;border-radius:16px;padding:28px;box-shadow:0 4px 20px rgba(0,0,0,.08);border:2px solid transparent;transition:border-color .2s}
.plan-card:hover{border-color:#667eea}
.plan-card.featured{border-color:#667eea;position:relative}
.plan-card.featured::before{content:'Most Popular';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#667eea;color:#fff;padding:4px 16px;border-radius:20px;font-size:.8rem;font-weight:600}
.plan-data{font-size:2rem;font-weight:800;color:#667eea}
.plan-duration{color:#888;margin:4px 0 16px}
.plan-price{font-size:1.8rem;font-weight:700}
.plan-price span{font-size:1rem;font-weight:400;color:#888}
.plan-features{list-style:none;margin:16px 0;font-size:.9rem;color:#555}
.plan-features li{padding:4px 0}
.plan-features li::before{content:'✓ ';color:#38a169;font-weight:700}
.plan-btn{display:block;text-align:center;background:#667eea;color:#fff;padding:12px;border-radius:10px;text-decoration:none;font-weight:600;margin-top:20px;transition:background .2s}
.plan-btn:hover{background:#5a6fd6}
.features{padding:60px 20px}
.features h2{text-align:center;font-size:2rem;margin-bottom:40px}
.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;max-width:900px;margin:0 auto}
.feature-item{text-align:center;padding:24px}
.feature-icon{font-size:2.5rem;margin-bottom:12px}
.feature-item h3{font-size:1.1rem;margin-bottom:8px}
.feature-item p{color:#666;font-size:.95rem;line-height:1.6}
.how-it-works{background:#f8f9ff;padding:60px 20px}
.how-it-works h2{text-align:center;font-size:2rem;margin-bottom:40px}
.steps{display:flex;flex-direction:column;gap:20px;max-width:600px;margin:0 auto}
.step{display:flex;align-items:flex-start;gap:16px}
.step-num{background:#667eea;color:#fff;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}
.step-text h3{font-size:1.05rem;margin-bottom:4px}
.step-text p{color:#666;font-size:.9rem}
.faq{padding:60px 20px}
.faq h2{text-align:center;font-size:2rem;margin-bottom:40px}
.faq-list{max-width:700px;margin:0 auto}
.faq-item{border-bottom:1px solid #eee;padding:20px 0}
.faq-item h3{font-size:1.05rem;margin-bottom:8px;cursor:pointer}
.faq-item p{color:#555;line-height:1.7;font-size:.95rem}
.cta-bottom{background:linear-gradient(135deg,${country.gradient});color:#fff;padding:60px 20px;text-align:center}
.cta-bottom h2{font-size:2rem;margin-bottom:16px}
.cta-bottom p{opacity:.9;margin-bottom:32px}
.btn-white{display:inline-block;background:#fff;color:#667eea;font-weight:700;padding:16px 40px;border-radius:50px;text-decoration:none}
footer{background:#1a1a2e;color:#999;padding:30px 20px;text-align:center;font-size:.9rem}
footer a{color:#999;text-decoration:none;margin:0 12px}
.breadcrumb{padding:12px 20px;font-size:.85rem;color:#888;max-width:960px;margin:0 auto}
.breadcrumb a{color:#667eea;text-decoration:none}
.trust-badges{display:flex;justify-content:center;gap:32px;margin-top:32px;flex-wrap:wrap}
.trust-badge{display:flex;align-items:center;gap:8px;font-size:.95rem;opacity:.9}
@media(max-width:640px){.nav-links a:not(.nav-cta){display:none}.trust-badges{gap:16px;font-size:.85rem}}
</style>
</head>
<body>
<nav class="nav">
  <a href="/" class="nav-logo">${country.emoji} SimRyoko</a>
  <div class="nav-links">
    <a href="/shop">Shop</a>
    <a href="/how-to-install-esim-iphone">Install Guide</a>
    <a href="/blog">Blog</a>
    <a href="/shop" class="nav-cta">Get eSIM</a>
  </div>
</nav>

<div class="breadcrumb">
  <a href="/">Home</a> › <a href="/shop">eSIM Plans</a> › ${country.name} eSIM
</div>

<section class="hero">
  <div class="badge">${country.emoji} ${typeText} eSIM</div>
  <h1>${country.name} eSIM</h1>
  <p>Stay connected in ${country.name} with instant eSIM activation. No physical SIM card needed, no roaming fees. Coverage in ${citiesText} and beyond.</p>
  <a href="#plans" class="btn-primary">View Plans from $${country.price}</a>
  <div class="trust-badges">
    <div class="trust-badge">⚡ Instant Delivery</div>
    <div class="trust-badge">🌐 ${country.carrier} Network</div>
    <div class="trust-badge">💬 24/7 Support</div>
  </div>
</section>

<section class="plans" id="plans">
  <h2>${country.name} eSIM Plans</h2>
  <div class="plan-grid">
    <div class="plan-card">
      <div class="plan-data">1 GB</div>
      <div class="plan-duration">7 Days</div>
      <div class="plan-price">$${country.price} <span>USD</span></div>
      <ul class="plan-features">
        <li>4G/LTE Speed</li>
        <li>${country.carrier} Network</li>
        <li>Instant Activation</li>
      </ul>
      <a href="/checkout?plan=${country.slug}-1gb" class="plan-btn">Buy Now</a>
    </div>
    <div class="plan-card featured">
      <div class="plan-data">3 GB</div>
      <div class="plan-duration">15 Days</div>
      <div class="plan-price">$${(country.price * 2.2).toFixed(0)} <span>USD</span></div>
      <ul class="plan-features">
        <li>4G/LTE Speed</li>
        <li>${country.carrier} Network</li>
        <li>Instant Activation</li>
        <li>Tethering Allowed</li>
      </ul>
      <a href="/checkout?plan=${country.slug}-3gb" class="plan-btn">Buy Now</a>
    </div>
    <div class="plan-card">
      <div class="plan-data">5 GB</div>
      <div class="plan-duration">30 Days</div>
      <div class="plan-price">$${(country.price * 3.5).toFixed(0)} <span>USD</span></div>
      <ul class="plan-features">
        <li>4G/5G Speed</li>
        <li>${country.carrier} Network</li>
        <li>Instant Activation</li>
        <li>Tethering Allowed</li>
      </ul>
      <a href="/checkout?plan=${country.slug}-5gb" class="plan-btn">Buy Now</a>
    </div>
    <div class="plan-card">
      <div class="plan-data">10 GB</div>
      <div class="plan-duration">30 Days</div>
      <div class="plan-price">$${(country.price * 5.5).toFixed(0)} <span>USD</span></div>
      <ul class="plan-features">
        <li>4G/5G Speed</li>
        <li>${country.carrier} Network</li>
        <li>Instant Activation</li>
        <li>Tethering Allowed</li>
        <li>Best Value</li>
      </ul>
      <a href="/checkout?plan=${country.slug}-10gb" class="plan-btn">Buy Now</a>
    </div>
  </div>
</section>

<section class="features">
  <h2>Why Choose SimRyoko for ${country.name}?</h2>
  <div class="feature-grid">
    <div class="feature-item">
      <div class="feature-icon">⚡</div>
      <h3>Instant Activation</h3>
      <p>Get connected in minutes. Scan the QR code and you're online — no waiting, no store visits needed.</p>
    </div>
    <div class="feature-item">
      <div class="feature-icon">💰</div>
      <h3>Save Up to 90%</h3>
      <p>Avoid expensive roaming charges. Our ${country.name} eSIM plans start from just $${country.price}.</p>
    </div>
    <div class="feature-item">
      <div class="feature-icon">📶</div>
      <h3>Reliable Coverage</h3>
      <p>Connected to ${country.carrier} network with 4G/5G coverage across ${citiesText}.</p>
    </div>
    <div class="feature-item">
      <div class="feature-icon">🔒</div>
      <h3>Keep Your Number</h3>
      <p>Your eSIM runs alongside your existing SIM. Keep your home number for calls while using data locally.</p>
    </div>
  </div>
</section>

<section class="how-it-works">
  <h2>How It Works</h2>
  <div class="steps">
    <div class="step">
      <div class="step-num">1</div>
      <div class="step-text">
        <h3>Choose Your Plan</h3>
        <p>Select the ${country.name} eSIM plan that fits your travel needs.</p>
      </div>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <div class="step-text">
        <h3>Receive QR Code</h3>
        <p>Get your eSIM QR code instantly via email after purchase.</p>
      </div>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <div class="step-text">
        <h3>Scan & Connect</h3>
        <p>Scan the QR code on your phone and enjoy mobile data in ${country.name}!</p>
      </div>
    </div>
  </div>
</section>

<section class="faq">
  <h2>Frequently Asked Questions</h2>
  <div class="faq-list">
    <div class="faq-item">
      <h3>Is my phone compatible with eSIM?</h3>
      <p>Most modern smartphones support eSIM, including iPhone XS and newer, Samsung Galaxy S20+, Google Pixel 3 and newer. Check our <a href="/check-compatibility">compatibility checker</a> to confirm.</p>
    </div>
    <div class="faq-item">
      <h3>How fast is the data connection in ${country.name}?</h3>
      <p>Our ${country.name} eSIM connects to ${country.carrier}'s network, providing 4G/LTE speeds in most areas. 5G is available in select cities.</p>
    </div>
    <div class="faq-item">
      <h3>Can I use the eSIM for calls and SMS?</h3>
      <p>Our ${country.name} eSIM plans are data-only. You can make calls using apps like WhatsApp, FaceTime, or Skype over your data connection.</p>
    </div>
    <div class="faq-item">
      <h3>When does my plan start?</h3>
      <p>Your ${country.name} eSIM plan activates when you first connect to a local network, so you can install it before your trip.</p>
    </div>
    <div class="faq-item">
      <h3>Can I get a refund?</h3>
      <p>Yes, unused eSIMs can be refunded within 30 days of purchase. Once activated, we offer partial refunds on a case-by-case basis.</p>
    </div>
  </div>
</section>

<section class="cta-bottom">
  <h2>Ready for ${country.name}?</h2>
  <p>Get your eSIM now and stay connected from the moment you arrive.</p>
  <a href="#plans" class="btn-white">Get ${country.name} eSIM — From $${country.price}</a>
</section>

<footer>
  <p>© 2026 SimRyoko. All rights reserved.</p>
  <p style="margin-top:8px">
    <a href="/terms">Terms</a>
    <a href="/privacy">Privacy</a>
    <a href="/faq">FAQ</a>
    <a href="/blog">Blog</a>
  </p>
</footer>

<script>
// Structured data for SEO
const ld = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "${country.name} eSIM",
  "description": "eSIM data plan for ${country.name}. Instant activation, ${country.carrier} network coverage.",
  "brand": {"@type": "Brand", "name": "SimRyoko"},
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "${country.price}",
    "highPrice": "${(country.price * 5.5).toFixed(0)}",
    "priceCurrency": "USD",
    "offerCount": "4"
  }
};
const s = document.createElement('script');
s.type = 'application/ld+json';
s.textContent = JSON.stringify(ld);
document.head.appendChild(s);
</script>
</body>
</html>`;
}

// Generate all pages
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

let count = 0;
for (const country of allCountries) {
  const filename = `${country.slug}-esim.html`;
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, generatePage(country));
  count++;
}

// Generate index/sitemap for countries
const indexContent = allCountries.map(c => 
  `<url><loc>https://simryoko.com/countries/${c.slug}-esim</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
).join('\n');

const sitemapAddition = `<!-- Country pages sitemap entries (${count} pages) -->\n${indexContent}`;
fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-countries.xml'), 
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexContent}\n</urlset>`);

// Generate country index page
const regionGroups = {};
for (const c of allCountries) {
  if (!regionGroups[c.region]) regionGroups[c.region] = [];
  regionGroups[c.region].push(c);
}

let indexHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>eSIM for 200+ Countries — SimRyoko</title>
<meta name="description" content="Buy eSIM for 200+ countries. Instant activation, affordable data plans. Compare eSIM plans for every destination.">
<link rel="canonical" href="https://simryoko.com/countries">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',-apple-system,sans-serif;color:#1a1a2e;background:#f8f9ff}
.header{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:60px 20px;text-align:center}
.header h1{font-size:2.5rem;font-weight:800;margin-bottom:12px}
.header p{opacity:.9;font-size:1.1rem}
.container{max-width:1100px;margin:0 auto;padding:40px 20px}
.region{margin-bottom:40px}
.region h2{font-size:1.5rem;margin-bottom:16px;color:#667eea;border-bottom:2px solid #667eea;padding-bottom:8px;display:inline-block}
.country-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-top:16px}
.country-link{display:flex;align-items:center;gap:8px;padding:12px 16px;background:#fff;border-radius:10px;text-decoration:none;color:#1a1a2e;box-shadow:0 2px 8px rgba(0,0,0,.06);transition:transform .2s}
.country-link:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.1)}
.country-link .price{margin-left:auto;color:#667eea;font-weight:700;font-size:.9rem}
footer{background:#1a1a2e;color:#999;padding:30px 20px;text-align:center;font-size:.9rem}
</style></head><body>
<div class="header"><h1>🌍 eSIM for 200+ Countries</h1><p>Choose your destination and get connected instantly</p></div>
<div class="container">`;

for (const [region, countries] of Object.entries(regionGroups)) {
  indexHtml += `<div class="region"><h2>${region}</h2><div class="country-grid">`;
  for (const c of countries) {
    indexHtml += `<a href="/countries/${c.slug}-esim" class="country-link">${c.emoji} ${c.name}<span class="price">$${c.price}</span></a>`;
  }
  indexHtml += `</div></div>`;
}

indexHtml += `</div><footer><p>© 2026 SimRyoko</p></footer></body></html>`;
fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml);

console.log(`✅ Generated ${count} country landing pages`);
console.log(`✅ Generated country index page`);
console.log(`✅ Generated sitemap-countries.xml`);
console.log(`\nCountries by region:`);
for (const [region, cs] of Object.entries(regionGroups)) {
  console.log(`  ${region}: ${cs.length}`);
}
